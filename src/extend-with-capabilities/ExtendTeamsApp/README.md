# 03 - Teams SSO

Changes:

1. Register an app (I used the Teams SSO video app as-is) and add the client ID to .env file
   
2. Update Teams app packaging
  - Add webApplicationInfo in the manifest and bump the revision number
  - If you grab the new files in the manifest folder, you should be able to just rerun 
    npm run package. This will add the webApplicationInfo to the manifest and bump the revision number
  - Update the app in Teams

3. Add Azure AD SSO with identity mapping
  - Add aadLogin.html and aadLogin.js
  - Update identityService.js to redirect to aadLogin.html instead of teamsLoginLauncher.html
  - npm install azure-ad-jwt
  - Modify server\server.js to add validateAadLogin method

Now it should use AAD login. First time a new user logs in, it will request they log into the
Northwind service to "link" their account to the AAD account. Since the mapping is stored in
memory (a simple array) the linkages will be lost whenever the server restarts (good for
testing!)

