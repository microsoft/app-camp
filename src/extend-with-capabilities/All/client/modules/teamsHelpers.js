import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

let teamsInitPromise;
export function ensureTeamsSdkInitialized() {
  if (!teamsInitPromise) {
    teamsInitPromise = microsoftTeams.app.initialize();
  }
  return teamsInitPromise;
}
// async function returns true/false if we're running in M365
export async function inM365() {
  try {
    await ensureTeamsSdkInitialized();
    return true;
  }
  catch (e) {
    console.log(`${e} from Teams SDK, may be running outside of M365`);
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
const setHostAppTheme = (fileName) => {
  let element = document.createElement("link");
  element.setAttribute("rel", "stylesheet");
  element.setAttribute("type", "text/css");
  element.setAttribute("href", fileName);
  document.getElementsByTagName("head")[0].appendChild(element);
}

// Inline code to set theme on any page using teamsHelpers
(async () => {
  await ensureTeamsSdkInitialized();
  if (await inM365()) {
    const context = await microsoftTeams.app.getContext();
    if (context) {
      setTheme(context.theme);
      switch (context.app.host.name) {
        case microsoftTeams.HostName.teams: {
          setHostAppTheme("../northwind.css");
        };
          break;
        case microsoftTeams.HostName.outlook: {
          setHostAppTheme("../styles/northwind-outlook.css");
        };
          break;
        case microsoftTeams.HostName.office: {
          setHostAppTheme("../styles/northwind-office.css");
        }
          break;
        default: { //any other hub for future
          setHostAppTheme("../northwind.css");
        }
          // When the theme changes
          microsoftTeams.app.registerOnThemeChangeHandler((theme) => {
            setTheme(theme);
          });
      }
    }
  }
  else {
    setHostAppTheme("../northwind.css"); // browser app
  }
})();





