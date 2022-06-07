import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

let teamsInitPromise;
export function ensureTeamsSdkInitialized() {
    if (!teamsInitPromise) {
        teamsInitPromise = microsoftTeams.app.initialize();
    }
    return teamsInitPromise;
}

// async function returns true if we're running in Teams
export async function inTeams() {
    try {
        await ensureTeamsSdkInitialized();
        const context = await microsoftTeams.app.getContext();
        return (context.app.host.name === microsoftTeams.HostName.teams);
    }
    catch (e) {
        console.log(`${e} from Teams SDK, may be running outside of Teams`);
        return false;
    }
}

// async function returns true if app is running in side panel in a Teams meeting
export async function inSidePanel() {
    try {
        await ensureTeamsSdkInitialized();
        const { page } = await microsoftTeams.app.getContext();
        return page.frameContext === microsoftTeams.FrameContexts.sidePanel;
    } catch (e) {
        console.log(`${e} from Teams SDK, may be running outside of Teams`);
        return false;
    }
}

// async function returns true if app has been shared to stage in a Teams meeting
export async function sharedToStage() {
    try {
        await ensureTeamsSdkInitialized();
        const { isAppSharing } = await microsoftTeams.meeting.getAppContentStageSharingState();
        return isAppSharing;
    } catch (e) {
        console.log(`${e} from Teams SDK, may be running outside of Teams`);
        return false;
    }
}

// Set the CSS to reflect the current Teams theme
function setTheme(theme) {
    const el = document.documentElement;
    el.setAttribute('data-theme', theme); // switching CSS
};

// Inline code to set theme on any page using teamsHelpers
(async () => {
    await ensureTeamsSdkInitialized();
    const context = await microsoftTeams.app.getContext();
    setTheme(context.app.theme);

    // When the theme changes, update the CSS again
    microsoftTeams.registerOnThemeChangeHandler((theme) => {
        setTheme(theme);
    });
})();
