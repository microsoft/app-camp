import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

let isInitialized = false;
export async function ensureTeamsSdkInitialized() {
    if (!isInitialized) {
        await microsoftTeams.app.initialize();
        isInitialized = true;
    }
}

// async function returns true if we're running in Teams
export async function inTeams() {
    try {
        await ensureTeamsSdkInitialized();
        const context = await microsoftTeams.app.getContext();
        return (context.app.host.name === microsoftTeams.HOST_NAME.teams);
    }
    catch (e) {
        console.log(`${e} from Teams SDK, may be running outside of Teams`);    
        return false;
    }
}
