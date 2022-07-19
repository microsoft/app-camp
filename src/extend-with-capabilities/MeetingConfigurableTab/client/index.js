import {
    getLoggedInEmployee
} from './identity/identityClient.js';

async function displayUI() {

    const displayElement = document.getElementById('content');
    const messageDiv = document.getElementById('message');

    try {
        const employee = await getLoggedInEmployee();
        if (employee) {
            displayElement.innerHTML = `
                <h3>Welcome ${employee.displayName}</h3>
            `;
        }
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error)}`;
    }
}


displayUI();