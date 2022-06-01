import 'https://statics.teams.cdn.office.net/sdk/v1.11.0/js/MicrosoftTeams.min.js';

const teamsLoginLauncherButton = document.getElementById('teamsLoginLauncherButton');

microsoftTeams.initialize(() => {

   teamsLoginLauncherButton.addEventListener('click', async ev => {
      microsoftTeams.authentication.authenticate({
         url: `${window.location.origin}/identity/login.html?teams=true`,
         width: 600,
         height: 535,
         successCallback: (response) => {
            window.location.href = document.referrer;
         },
         failureCallback: (reason) => {
            throw `Error in teams.authentication.authenticate: ${reason}`
         }
      });
   });
   
});
