# 02 - Teams App

## Exercise outline

1. Add Teams app packaging
  - add manifest folder and contents
  - modify package.json
  - add TEAMS_APP_ID and HOST_NAME to the .env file
  - npm run package to generate the app package
  - upload the app into Teams

Now the app should appear in Teams but you can't log in because you're in an IFrame!

2. Add Teams login page
  - add teamsHelpers.js
  - add teamsLoginLauncher.html and teamsLoginLauncher.js
  - modify the logoff() method in identityService.js to redirect to teamsLoginLauncher when running in Teams
  - modify login.js to call notifySuccess rather than do a redirect if running in Teams

Now you can log in! Walk through the differences between login.js and teamsLogin.js.
However the navigation is duplicated between Teams and the app so,

3. Modify navigation.js to only show when not in Teams
