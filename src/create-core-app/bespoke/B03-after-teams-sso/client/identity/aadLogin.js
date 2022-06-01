import 'https://statics.teams.cdn.office.net/sdk/v1.11.0/js/MicrosoftTeams.min.js';
import {
    setLoggedinEmployeeId
} from './identityClient.js';

const teamsLoginLauncher = document.getElementById('teamsLoginLauncher');
const teamsLoginLauncherButton = document.getElementById('teamsLoginLauncherButton');

microsoftTeams.initialize(async () => {

    const authToken = await new Promise((resolve, reject) => {
        microsoftTeams.authentication.getAuthToken({
            successCallback: (result) => { resolve(result); },
            failureCallback: (error) => { reject(error); }
        });
    });

    const response = await fetch(`/api/validateAadLogin`, {
        "method": "post",
        "headers": {
            "content-type": "application/json",
            "authorization": `Bearer ${authToken}`
        },
        "body": JSON.stringify({
            "employeeId": 0
        }),
        "cache": "no-cache"
    });
    if (response.ok) {
        const data = await response.json();
        if (data.employeeId) {
            // If here, AAD user was mapped to a Northwind employee ID
            setLoggedinEmployeeId(data.employeeId);
            window.location.href = document.referrer;
        }
    } else if (response.status === 404) {

        // If here, AAD user logged in but there was no mapping to an employee ID. Get one now.
        teamsLoginLauncherButton.addEventListener('click', async ev => {
            microsoftTeams.authentication.authenticate({
                url: `${window.location.origin}/identity/login.html?teams=true`,
                width: 600,
                height: 535,
                successCallback: async (northwindCredentials) => {
                    const response = await fetch(`/api/validateAadLogin`, {
                        "method": "post",
                        "headers": {
                            "content-type": "application/json",
                            "authorization": `Bearer ${authToken}`
                        },
                        "body": JSON.stringify({
                            "username": northwindCredentials.username,
                            "password": northwindCredentials.password
                        }),
                        "cache": "no-cache"
                    });
                    setLoggedinEmployeeId(northwindCredentials.employeeId);
                    window.location.href = document.referrer;
                },
                failureCallback: (reason) => {
                    throw `Error in teams.authentication.authenticate: ${reason}`
                }
            });
        });
        teamsLoginLauncher.style.display = "inline";

    } else {
        console.log(`Error ${response.status} on /api/validateAadLogin: ${response.statusText}`);
    }
});
