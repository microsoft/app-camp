---8<--- "heading2.md"

# Lab 3: Link unfurling

???+ info "Lab Outline"

    * __[Lab 1 - Create your first app with Teams Toolkit](./01-create-app.md)__
    In this lab, you'll set up Teams Toolkit create a Teams message extension
    * __[Lab 2 - Integrate business data with your application](./02-integrate-web-service.md)__
    In this lab, you'll brand your new app as "Northwind Suppliers", and will provide the ability to insert data from the Northwind Traders sample database in a Microsoft Teams conversation. You'll also learn how to create and send adaptive cards with your message extension.
    * __<span style="color: red;">THIS LAB:</span>
    [Lab 3 - Add link unfurling](./03-add-link-unfurling.md)__
    In this lab, you'll learn how to use Link Unfurling, which provides a custom summary when a user includes your URL in a conversation
    * __[Lab 4 - Action message extensions with Open AI](./04-add-ai.md)__
    In this lab, you'll learn how to build "Action" message extensions which can be launched directly
    or in the context menu of another Teams message to take action on it. The labs use the Open AI
    commercial web services (in Azure or using an Open AI account) to generate messages.
    * __[Lab 5 - Single Sign-on and Microsoft Graph](./05-add-sso.md)__
    In this lab, you'll learn how to authenticate users with Azure AD Single Sign-On, and to call the
    Microsoft Graph API. This same process would be used when calling any
    web service that's secured with Azure AD on behalf of the logged-in user.


## Overview

In this lab you'll implement basic Link Unfurling, which is a feature that brings your app into view when users share a hyperlink.

We've all seen link unfurling yet may not have called it by name. It's the little summary that appears when you share a link on social media; think of it like unfurling a flag, only it's a hyperlink. Teams apps can register to unfurl links from specific domain names; when a link for that domain is used in a Teams conversation, your app gets to display an adaptive card. 

While this lab will simply display some details about a Northwind supplier, your application could include any feature of an adaptive card such as input fields, action buttons, or even just a modified link that deep links users into your app within Microsoft Teams. For example, a user who has never used your app in Teams might paste a link from your web-based app into a chat thread. The link unfurler could then display a button that deep links them into the app within Teams; this is a great way to drive user discovery of your app.

## Features

- A link unfurler for _northwindtraders.com_ that displays information about a supplier whose ID is on the query string

!!! note
    This lab builds on the solution from [Labs 1](./01-create-app.md) [and 2](./02-integrate-web-service.md). Please complete them before continuing.

## Exercise 1: Add a message handler to the app mainfest

Open your project in Visual Studio Code and edit the **appPackage/manifest.json** file. Find the `commands` property under `composeExtensions`. Immediately after the `commands` property add a new property 

```json
    "messageHandlers": [
        {
            "type": "link",
            "value": {
                "domains": [
                "*.northwindtraders.com"
                ]
            }
        }
    ]
```

After doing that, your `composeExtensions` property should look like this, followed immediately by `configurableTabs`:

```json
"composeExtensions": [
    {
        "botId": "${{BOT_ID}}",
        "commands": [
            {
                "id": "searchQuery",
                "context": [
                    "compose",
                    "commandBox"
                ],
                "description": "Look up a Northwind supplier",
                "title": "Supplier search",
                "type": "query",
                "parameters": [
                    {
                        "name": "searchQuery",
                        "title": "Supplier search",
                        "description": "Look up a Northwind supplier",
                        "inputType": "text"
                    }
                ]
            }
        ],
        "messageHandlers": [
            {
                "type": "link",
                "value": {
                    "domains": [
                    "*.northwindtraders.com"
                    ]
                }
            }
        ]
    }
],
```

This instructs Teams to watch for links with host names matching the wildcard "*.northwindtraders.com", which is a DNS name registered by Microsoft for demo purposes (it just leads to microsoft.com). Your message extension will run whenever a link such as [https://www.northwindtraders.com/suppliers?supplierID=5](https://www.northwindtraders.com/suppliers?supplierID=5){target=_blank} is entered.

## Exercise 2: Update the application code

### Step 1: Add code for the message extension

Add a file to the **messageExtensions** folder called **northwindLinkME.js**, and paste this code inside:

```json
const axios = require("axios");
const { CardFactory } = require("botbuilder");

class NorthwindLinkME {

    async handleTeamsAppBasedLinkQuery (context, query) {

        const url = query.url;

        // Ensure the host name ends with northwindtraders.com
        const host = new URL(url).hostname;
        if (host.endsWith("northwindtraders.com")) {

            // Get the supplier ID from the URL
            const supplierID = new URL(url).searchParams.get("supplierID");
            if (supplierID) {

                // Make a thumbnail card to show if the supplier is not found
                let attachment = CardFactory.thumbnailCard("Supplier not found");
                try {
                    // Get the supplier details from the Northwind OData service
                    const supplierResponse = await axios.get(
                        `https://services.odata.org/V4/Northwind/Northwind.svc/Suppliers(${supplierID})`
                    );

                    if (supplierResponse.data?.SupplierID) {

                        const supplier = supplierResponse.data;
                        const flagUrl = this.#getFlagUrl(supplier.Country);
                        attachment = CardFactory.thumbnailCard(supplier.CompanyName,
                            `${supplier.City}, ${supplier.Country}`, [flagUrl]);

                    }

                } catch (error) {
                    console.log(error);
                }

                const response = {
                    composeExtension: {
                        attachmentLayout: 'list',
                        type: 'result',
                        attachments: [attachment]
                    }
                };
                return response;

            }
        }
    }

    // Get a flag image URL given a country name
    // Thanks to https://flagpedia.net for providing flag images
    #getFlagUrl (country) {

        const COUNTRY_CODES = {
            "australia": "au",
            "brazil": "br",
            "canada": "ca",
            "denmark": "dk",
            "france": "fr",
            "germany": "de",
            "finland": "fi",
            "italy": "it",
            "japan": "jp",
            "netherlands": "nl",
            "norway": "no",
            "singapore": "sg",
            "spain": "es",
            "sweden": "se",
            "uk": "gb",
            "usa": "us"
        };

        return `https://flagcdn.com/32x24/${COUNTRY_CODES[country.toLowerCase()]}.png`;

    };
}

module.exports.NorthwindLinkME = new NorthwindLinkME();
```

???+ note "Code walk-through"
    
    When Teams sees a link with a matching host name, it sends an Invoke Activity to your application. The Bot receives this and calls your `handleTeamsAppBasedLinkQuery` event handler. `NorthwindLinkME` contains the code that handles this event.

    It first checks to ensure the hostname ends with "northwindtraders.com"; if the app contained more than one link message handler, you could check which one in this fashion. It then attempts to extract a supplier ID from the URL, and it looks up the supplier using [Northwind sample OData service](https://www.odata.org/odata-services/#3){target="_blank"}.

    If it finds a supplier, it returns a tumbnail card with the supplier's name, city, country, and national flag. If not, it returns a card that says, "Supplier not found".

### Step 2: Update the bot to call the NorthwindLinkME

Now open **teamsBot.js**. At the top of the file, import the message extension code you just added.

```javascript
const { NorthwindLinkME } = require("./messageExtensions/northwindLinkME");
```

Now add an event handler to the `TeamsBot` class, right underneath the `handleTeamsMessagingExtensionSelectItem` method you added in the previous lab. The `TeamsBot`'s base class is a `TeamsActivityHandler` from the Bot framework; it will know to call this method when a link needs to be unfurled.

```javascript
async handleTeamsAppBasedLinkQuery(context, query) {

  return NorthwindLinkME.handleTeamsAppBasedLinkQuery(context, query);

}
```

## Exercise 3: Run the app




--8<-- "i-finished.md"

## Known issues

--8<-- "issuesLink.md"

## Next steps

After completing this lab, you may continue to the next lab in this learning path, [lab-name](./02-lab-something.md).

<img src="https://pnptelemetry.azurewebsites.net/app-camp/new-adventure/Lab0x" />

