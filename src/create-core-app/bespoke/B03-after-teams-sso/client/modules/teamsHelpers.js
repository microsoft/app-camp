import 'https://statics.teams.cdn.office.net/sdk/v1.11.0/js/MicrosoftTeams.min.js';

// async function returns true if we're running in Teams
export async function inTeams() {
    // There is no supported way to do this in the Teams JavaScript SDK v1.
    // The official guidance is to indicate the app is running in Teams via
    // the URL. This workaround is used by the "yo teams" generator so is in
    // wide use. See the "yo teams" base class here:
    // https://github.com/wictorwilen/msteams-react-base-component/blob/master/src/useTeams.ts#L10
    return (window.parent === window.self && window.nativeInterface) ||
        window.navigator.userAgent.includes("Teams/") ||
        window.name === "embedded-page-container" ||
        window.name === "extension-tab-frame";
}
