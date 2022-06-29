import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import { ensureTeamsSdkInitialized } from '../modules/teamsHelpers.js';
import {env} from '../modules/env.js'
async function displayUI() {
    await ensureTeamsSdkInitialized();
    document.getElementById('orderForm').addEventListener("submit", async (e) => {
        let orderFormInfo = {
            notes: document.forms["orderForm"]["notes"].value,
        };     
        await microsoftTeams.dialog.submit(orderFormInfo,env.TEAMS_APP_ID);
        return true;
    });
}
displayUI();

