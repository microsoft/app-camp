# Search Message Extension

## Summary

This sample is a Search message extension created from using the core teams application built over the course of labs [A01](../../../lab-instructions/aad/A01-begin-app.md)-[A03](../../../lab-instructions/aad/A03-after-apply-styling.md) to get to the Northwind Orders core application. It inserts information about Northwind products into the compose box where team members can update stock value.

Users can search the Northwind database when composing a message and find the product.

<img src="../../../../assets/screenshots/06-004-searchproduct.png?raw=true" alt="Search product"/>

Select a product and insert an adaptive card which is a form with product details and stock input, into the conversation.

<img src="../../../assets/screenshots/06-005-previewproduct.png?raw=true" alt="Select product"/>

The members in the team can then update stock information in the same conversation, by adding stock unit value in the input field and select **Update stock**.

<img src="../../../assets/screenshots/06-007-updatepdt.png?raw=true" alt="Product update form"/>

Once it's successfully updated, the card refreshes to show the new stock value.
<img src="../../../assets/screenshots/06-008-updated.png?raw=true" alt="Product updated"/>

## Frameworks

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.7-green.svg)


## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|February 2022|Rabia Williams|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone or download the sample from [https://github.com/microsoft/app-camp](https://github.com/microsoft/app-camp)

- In a console, navigate to `src/extend-with-capabilities/MessagingExtension/` from the main folder `m365-msteams-northwind-app-samples`.

    ```bash
    cd src/extend-with-capabilities/MessagingExtension/
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
    ngrok http -host-header=rewrite 3978
    ```

- Since message extensions utilize the  Bot Framework, you will need to register a new bot. 
[Follow these instructions](https://github.com/microsoft/app-camp/blob/main/lab-instructions/aad/MessagingExtension.md#exercise-1-bot-registration).


- Update the `.env` configuration for the bot to use the Bot id and Client secret.

BOT_REG_AAD_APP_ID=&lt;Bot id&gt;
BOT_REG_AAD_APP_PASSWORD=&lt;Client Secret&gt;


- Package the app

    ```bash
    npm run package
    ```

- Run the bot locally
    ```bash
    npm start
    ```

- Upload the the packaged zip file inside `manifest` folder into Teams [using these instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload).

- Test in Microsoft Teams by clicking the ... beneath the compose box in a Team where the application has been installed. Load the app.
- Search the product in the search box and select the desired product and post the card into the channel conversation.
- Update the stock value and select **Update stock**

## Features

This is a simple Search message extension to show case how you can search and display data from a third party data base in Microsoft Teams. It also shows how you can update data in the third party data base all in the same conversation.

## Debug and test locally

TBD