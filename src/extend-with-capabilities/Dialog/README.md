# Dialog

## Summary

This sample is an enhancement of the personal tab created from using the core teams application built over the course of labs [A01](/app-camp/../lab-instructions/aad/A01-begin-app.md)-[A03](/app-camp/../lab-instructions/aad/A03-after-apply-styling.md).

In this sample, the student gets use a web page and a dialog to capture and send information back to a Teams tab.

- Open a web based form in teams tab
- Add information from the form back to tab


![dialog working](/app-camp/../assets/taskmodule-working.gif)



## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|March 2022|Rabia Williams|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone or download the sample from [https://github.com/microsoft/app-camp](https://github.com/microsoft/app-camp)

- In a console, navigate to `src/extend-with-capabilities/Dialog/` from the main folder `m365-msteams-northwind-app-samples`.

    ```bash
    cd src/extend-with-capabilities/Dialog/
    ```

- Install modules

    ```bash
    npm install
    ```

- Run ngrok - point to port 3978

    ```bash
    ngrok http -host-header=rewrite 3978
    ```
- Download your local DB copy (Do this only once)

    ```bash
    npm run db-download
    ```
- Package the app

    ```bash
    npm run package
    ```

- Run the bot locally
    ```bash
    npm start
    ```

- Upload the the packaged zip file inside manifest folder into Teams [using these instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload).



## Features

User can open dialog form the tab application to capture notes on a particular order. 
On save, the form sends results back to the tab for further processing.

## Debug and test locally

TBD