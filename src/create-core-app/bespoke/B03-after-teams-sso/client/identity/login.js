import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import {
   validateEmployeeLogin,
   setLoggedinEmployeeId
} from './identityClient.js';

const loginPanel = document.getElementById('loginPanel');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const messageDiv = document.getElementById('message');
const hintUL = document.getElementById('hintList');

if (window.location !== window.parent.location) {
   // The page is in an iframe - refuse service
   messageDiv.innerText = "ERROR: You cannot run this app in an IFrame";
} else {

   loginPanel.style.display = 'inline';
   loginButton.addEventListener('click', logInUser);
   loginPanel.addEventListener('keypress', async function (e) {
      if (e.key === 'Enter') {
        await logInUser();
      }
   });
   
   async function logInUser (ev) {

      messageDiv.innerText = "";
      const employeeId = await validateEmployeeLogin(
         usernameInput.value,
         passwordInput.value
      );
      if (employeeId) {
         setLoggedinEmployeeId(employeeId);
         if (window.location.search.indexOf('teams=true') >= 0) {
            await microsoftTeams.app.initialize();
            microsoftTeams.authentication.notifySuccess({
               username: usernameInput.value,
               password: passwordInput.value,
               employeeId: employeeId
            });
         } else {
            window.location.href = document.referrer;
         }
      } else {
         messageDiv.innerText = "Error: user not found";
      }
   }
}