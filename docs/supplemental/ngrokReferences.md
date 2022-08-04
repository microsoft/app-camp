# ngrok URL use

The free version of ngrok generates a new URL every time you run it, so if you put the labs aside and return to them later you will need to update the URL. This page lists all the places where the ngrok URL is used so you can return to them and update them.

Following these steps, you'll need to upgrade the app in Teams with the new app package you've built so it gets the updated ngrok URL.

| Lab | Exercise | Step(s) | Use |
|---|---|---|--|
| A01 | 4 | 2 | [Redirect URL in the app registration (under "Authentication")](https://microsoft.github.io/app-camp/aad/A01-begin-app/#step-2-register-your-application-in-azure-active-directory){target="_blank"} |
| A01 | 4 | 5 | [Application URI contains the ngrok URL](https://microsoft.github.io/app-camp/aad/A01-begin-app/#step-5-expose-an-api){target="_blank"} |
| A01 | 5 | 4 | [HOST_NAME in the .env file contains the hostname portion of the ngrok URL](https://microsoft.github.io/app-camp/aad/A01-begin-app/#step-4-configure-the-app-settings){target="_blank"} |
| A01 | 5 | 5 | [Browse to the ngrok URL](https://microsoft.github.io/app-camp/aad/A01-begin-app/#step-5-run-the-application){target="_blank"} |
| A02 | 2 | 5 | [Build the application package](https://microsoft.github.io/app-camp/aad/A02-after-teams-sso/#step-5-build-the-package){target="_blank"} ALSO be sure to update the revision number in the app package so Teams will allow the update |
| B01 | 2 | 3 | [Browse to the ngrok URL](https://microsoft.github.io/app-camp/bespoke/B01-begin-app/#step-5-run-the-application){target="_blank"}
| B02 | 3 | 3 | [HOST_NAME in the .env file contains the hostname portion of the ngrok URL](https://microsoft.github.io/app-camp/bespoke/B02-after-teams-login/#step-3-add-the-teams-app-id-to-the-env-file){target="_blank"} |
| B02 | 2 | 5 | [Build the application package](https://microsoft.github.io/app-camp/aad/A02-after-teams-sso/#step-5-build-the-package){target="_blank"} Rebuild the app package AFTER fixing the ngrok URL in your .env file so the new package includes the updated URL. ALSO be sure to update the revision number in the app package so Teams will allow the update |
| B03 | 1 | 1 | [Redirect URL in the app registration (under "Authentication")](https://microsoft.github.io/app-camp/bespoke/B03-after-teams-sso/#step-1-register-your-application-in-azure-active-directory){target="_blank"} |
| B03 | 1 | 3 | [Application URI contains the ngrok URL](https://microsoft.github.io/app-camp/bespoke/B03-after-teams-sso/#step-3-expose-an-api){target="_blank"} |
| Message extension | 1 | 2 | [Application URI contains the ngrok URL](https://microsoft.github.io/app-camp/aad/MessagingExtension/#ex1-step3){target="_blank"} |






