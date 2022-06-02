import dotenv from 'dotenv';
import { getEmployeeByLastName } from './northwindDataService.js';
import aad from 'azure-ad-jwt';

import { dbService } from '../northwindDB/dbService.js';
const db = new dbService();

dotenv.config();

// Mock identity service based on Northwind employees

// Wire up middleware
export async function initializeIdentityService(app) {

    // Web service validates a user login
    app.post('/api/validateEmployeeLogin', async (req, res) => {

        try {
            const username = req.body.username;
            const password = req.body.password;
            const employeeId = await validateEmployeeLogin(username, password);
            res.send(JSON.stringify({ "employeeId": employeeId }));
        }
        catch (error) {
            console.log(`Error in /api/validateEmployeeLogin handling: ${error}`);
            res.status(500).json({ status: 500, statusText: error });
        }

    });

    // Web service validates an Azure AD login
    app.post('/api/validateAadLogin', async (req, res) => {

        try {
            const employeeId = await validateAndMapAadLogin(req, res);
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
    try {
        if (req.cookies.employeeId && parseInt(req.cookies.employeeId) > 0) {
            console.log(`Validated authentication on /api${req.path}`);
            next();
        } else {
            console.log(`Invalid authentication on /api${req.path}`);
            res.status(401).json({ status: 401, statusText: "Access denied" });
        }
    }
    catch (error) {
        res.status(401).json({ status: 401, statusText: error });
    }
}

async function validateEmployeeLogin(username, password) {

    // Trim the username and capitalize the first letter only
    let lastName = username.trim();
    lastName = lastName.substring(0, 1).toUpperCase() +
        lastName.substring(1).toLowerCase();

    // This is so insecure! We just throw away the password and the username
    // is the last name of any employee. The "token" will be the employee ID.
    const employee = await getEmployeeByLastName(lastName);
    if (employee) {
        return employee.id;
    } else {
        return null;
    }
}

// validateAndMapAadLogin() - Returns an employee ID of the logged in user based
// on an existing mapping OR the username/password passed from a client login.
// If there is no existing mapping and no username/password is specified, it will throw
// an exception.
async function validateAndMapAadLogin(req, res) {

    const audience = `api://${process.env.HOSTNAME}/${process.env.CLIENT_ID}`;
    const token = req.headers['authorization'].split(' ')[1];

    const aadUserId = await new Promise((resolve, reject) => {
        aad.verify(token, { audience: audience }, async (err, result) => {
            if (result) {
                resolve(result.oid);
            } else {
                reject(err);
            }
        });
    });

    if (aadUserId) {
        // If here, user is logged into Azure AD
        let employeeId = await getEmployeeIdForUser(aadUserId);
        if (employeeId) {
            // We found the employee ID for the AAD user
            return employeeId;
        } else if (req.body.username) {
            // We did not find an employee ID for this user, try to 
            // get one using the legacy authentication
            const username = req.body.username;
            const password = req.body.password;
            const employeeId = await validateEmployeeLogin(username, password);
            if (employeeId) {
                // If here, user is logged into both Azure AD and the legacy
                // authentication. Save the employee ID in the user's AAD
                // profile for future use.
                await setEmployeeIdForUser(aadUserId, employeeId);
                return employeeId;
            } else {
                // If here, the employee login failed; throw an exception
                throw ({ status: 401, statusMessage: "Employee login failed" });
            }
        } else {
            // If here we don't have an employee ID and employee credentials were
            // not provided.
            throw ({ status: 404, statusMessage: "Employee ID not found for this user" });
        }
    } else {
        res.status(401).send('Invalid AAD token');
    }
}

async function getEmployeeIdForUser(aadUserId) {

    const idMapDB = await db.getTable("IdentityMap", "aadUserId");
    const identity = idMapDB.item(aadUserId);
    return identity?.employeeId;
}

async function setEmployeeIdForUser(aadUserId, employeeId) {
    try {

        const identityMap = await db.getTable("IdentityMap", "aadUserId");
        if (identityMap.item(aadUserId)) {
            // User already mapped (shouldn't happen but handle it anyway)
            const item = identityMap.item(aadUserId);
            item.employeeId = employeeId;
        } else {
            identityMap.addItem({
                "aadUserId": aadUserId,
                "employeeId": employeeId
            });
        }
        await identityMap.save();

    }
    catch (error) {
        console.log(`Error updating user mapping ${error}`);
    }
}