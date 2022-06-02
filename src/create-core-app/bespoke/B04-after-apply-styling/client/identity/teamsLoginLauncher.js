import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';

const teamsLoginLauncherButton = document.getElementById('teamsLoginLauncherButton');

teamsLoginLauncherButton.addEventListener('click', async ev => {
   await microsoftTeams.initialize();
   await microsoftTeams.authentication.authenticate({
      url: `${window.location.origin}/identity/login.html?teams=true`,
      width: 600,
      height: 535,
   });
   window.location.href = document.referrer;
});
