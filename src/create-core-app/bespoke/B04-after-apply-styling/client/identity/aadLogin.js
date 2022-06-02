import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import {
    setLoggedinEmployeeId
} from './identityClient.js';

(async () => {

    const teamsLoginLauncher = document.getElementById('teamsLoginLauncher');
    const teamsLoginLauncherButton = document.getElementById('teamsLoginLauncherButton');

    await microsoftTeams.initialize();
    const authToken = await microsoftTeams.authentication.getAuthToken();

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

        // If here, AAD user logged in but there was no mapping to an employee ID.
        // Get one now using the bespoke authentication
        teamsLoginLauncherButton.addEventListener('click', async ev => {

            // First, launch the original login page to get the user credentials
            const northwindCredentials = await
                microsoftTeams.authentication.authenticate({
                    url: `${window.location.origin}/identity/login.html?teams=true`,
                    width: 600,
                    height: 535
                });

            // Now call the server with BOTH the Azure AD and original credentials
            // Server is responsible for linking them in its database for next time
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

            // Now log the user in with the bespoke system
            setLoggedinEmployeeId(northwindCredentials.employeeId);
            window.location.href = document.referrer;
        });

        teamsLoginLauncher.style.display = "inline";

    } else {

        console.log(`Error ${response.status} on /api/validateAadLogin: ${response.statusText}`);

    }

})();
