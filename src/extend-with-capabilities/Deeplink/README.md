# Deep linking

## Summary

This sample is an enhancement of the personal tab created from using the core teams application built over the course of labs [A01](../../../lab-instructions/lab-instructions/aad/A01-begin-app.md)-[A03](../../../lab-instructions/aad/A03-after-apply-styling.md).

In this sample, the student gets to explore deep linking in Microsoft Teams.

Copy the url to a particular order in `My orders` tab of the user. 

This link can then be shared via chat or email.
Another user can open this url to view the order details in their own personal tab.

![open deep link](../../../assets/deeplink-working.gif)

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|March 2022|Rabia Williams|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone or download the sample from [https://github.com/microsoft/app-camp](https://github.com/microsoft/app-camp)

- In a console, navigate to `src/extend-with-capabilities/Deeplink/` from the main folder `m365-msteams-northwind-app-samples`.

    ```bash
    cd src/extend-with-capabilities/Deeplink/
    ```

- Install modules

    ```bash
    npm install
    ```

- Run ngrok - point to port 3978

    ```bash
    ngrok http -host-header=rewrite 3978
    ```

- Package the app

    ```bash
    npm run package
    ```
- Download your local DB copy (Do this only once)

    ```bash
    npm run db-download
    ```

- Run the bot locally
    ```bash
    npm start
    ```

- Upload the the packaged zip file inside manifest folder into Teams [using these instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload).

## Features

User can share an order's link with their colleagues through email or chat. 

This link will directly take them to a personal tab with the order information displayed.


## Debug and test locally

TBD