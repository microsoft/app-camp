# Meeting App

## Summary

This sample is a Meeting app created from using the core teams application built over the course of labs [A01](../../../lab-instructions/aad/A01-begin-app.md)-[A03](../../../lab-instructions/aad/A03-after-apply-styling.md) to get to the Northwind Orders core application. It provides the meeting creator the ability to add a tab pre-meeting which attendees can use to view products of a given category.

In this sample, the student gets to explore how to surface information in Microsoft Teams Meetings.

## Version history

| Version | Date      | Author        | Comments        |
| ------- | --------- | ------------- | --------------- |
| 1.0     | June 2022 | Garry Trinder | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone or download the sample from [https://github.com/[OfficeDev/m365-msteams-northwind-app-samples](https://github.com/microsoft/app-camp)](https://github.com/microsoft/app-camp)

- In a console, navigate to `src/extend-with-capabilities/Meeting/` from the main folder `app-camp`.

    ```bash
    cd src/extend-with-capabilities/Meeting/
    ```

- Install modules

    ```bash
    npm install
    ```
- Download your local DB copy (Do this only once)

    ```bash
    npm run db-download
    ```

- Run ngrok - point to port 3978

    ```bash
    ngrok http --host-header=rewrite 3978
    ```

- Upload the the packaged zip file inside manifest folder into Teams [using these instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload).

- Create a new meeting with at least one participant in Microsoft Teams
  
- Edit the meeting and click the `Add a tab` (+) button

- Search for Northwind Traders app and add the Tab

- Select a Category in the dropdown to configure the tab to display a specific category of products