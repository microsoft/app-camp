import dotenv from 'dotenv';
import fetch from 'node-fetch';
import aad from 'azure-ad-jwt';
import * as msal from '@azure/msal-node';

dotenv.config();

// Wire up middleware
export async function initializeIdentityService(app) {

    // Web service validates an Azure AD login
    app.post('/api/validateAadLogin', async (req, res) => {

        try {
            const employeeId = await validateAadLogin(req, res);
            if (employeeId) {
                res.send(JSON.stringify({ "employeeId": employeeId }));
            } else {
                res.status(401).send('Unknown authentication failure');
            }
        }
        catch (error) {
            console.log(`Error in /api/validateAadLogin handling: ${error.statusMessage}`);
            res.status(error.status).json({ status: error.status, statusText: error.statusMessage });
        }

    });

    // Middleware to validate all other API requests
    app.use('/api/', validateApiRequest);

}

async function validateApiRequest(req, res, next) {
    const audience = `api://${process.env.HOST_NAME}/${process.env.CLIENT_ID}`;
    const token = req.headers['authorization'].split(' ')[1];

    aad.verify(token, { audience: audience }, async (err, result) => {
        if (result) {
            console.log(`Validated authentication on /api${req.path}`);
            next();
        } else {
            console.error(`Invalid authentication on /api${req.path}: ${err.message}`);
            res.status(401).json({ status: 401, statusText: "Access denied" });
        }
    });
}

// validateAadLogin() - Returns an employee ID of the logged in user
// Placing an employee ID in each user's M365 profile is a manual step, please
// see the lab instructions
async function validateAadLogin(req, res) {

    const audience = `api://${process.env.HOST_NAME}/${process.env.CLIENT_ID}`;
    const token = req.headers['authorization'].split(' ')[1];

    const aadUserId = await new Promise((resolve, reject) => {
        aad.verify(token, { audience: audience }, async (err, result) => {
            if (result) {
                resolve(result.oid);
            } else {
                console.error(`Error validating access token: ${err.message}`);
                reject(err);
            }
        });
    });

    if (aadUserId) {
        // If here, user is logged into Azure AD
        let employeeId = await getEmployeeIdForUser(token, aadUserId);
        if (employeeId) {
            // We found the employee ID for the AAD user
            return employeeId;
        } else {
            throw ({ status: 404, statusMessage: "Employee ID not found for this user" });
        }
    } else {
        res.status(401).send('Invalid AAD token');
    }
}

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";
const employeeIdCache = {};     // The employee mapping shouldn't change over time, so cache it here
async function getEmployeeIdForUser(incomingToken, aadUserId) {

    let employeeId;
    if (employeeIdCache[aadUserId]) {
        employeeId = employeeIdCache[aadUserId];
    } else {
        try {
            const graphToken = await getOboAccessToken(incomingToken, GRAPH_SCOPE);

            const graphResponse = await fetch(
                `https://graph.microsoft.com/v1.0/users/${aadUserId}?$select=employeeId`,
                {
                    "method": "GET",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${graphToken}`
                    }
                });
            if (graphResponse.ok) {
                const employeeProfile = await graphResponse.json();
                employeeId = employeeProfile.employeeId;
                employeeIdCache[aadUserId] = employeeId;
            } else {
                console.log(`Error ${graphResponse.status} calling Graph in getEmployeeIdForUser: ${graphResponse.statusText}`);
            }
        }
        catch (error) {
            console.log(`Error calling MSAL in getEmployeeIdForUser: ${error}`);
        }
    }
    return employeeId;
}

// TODO: Securely cache the results of this function for the lifetime of the resulting token
export async function getOboAccessToken(clientSideToken, scopes) {

    const tenantId = process.env.TENANT_ID;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    // Use On Behalf Of flow to exchange the client-side token for an
    // access token with the needed permissions
    
    const INTERACTION_REQUIRED_STATUS_TEXT = "interaction_required";
    const url = "https://login.microsoftonline.com/" + tenantId + "/oauth2/v2.0/token";
    const params = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: clientSideToken,
        requested_token_use: "on_behalf_of",
        scope: scopes
    };

    const accessTokenQueryParams = new URLSearchParams(params).toString();
    try {
        const oboResponse = await fetch(url, {
            method: "POST",
            body: accessTokenQueryParams,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const oboData = await oboResponse.json();
        if (oboResponse.status !== 200) {
            // We got an error on the OBO request. Check if it is consent required.
            if (oboData.error.toLowerCase() === 'invalid_grant' ||
                oboData.error.toLowerCase() === 'interaction_required') {
                throw (INTERACTION_REQUIRED_STATUS_TEXT);
            } else {
                console.log(`Error returned in OBO: ${JSON.stringify(oboData)}`);
                throw (`Error in OBO exchange ${oboResponse.status}: ${oboResponse.statusText}`);
            }
        }
        return oboData.access_token;
    } catch (error) {
        return error;
    }

}