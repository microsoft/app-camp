---8<--- "heading2.md"

# Lab 2: Integrate business data with your app

## Overview

In the previous lab, you created and ran a Search Message Extension using Teams Toolkit for Visual Studio Code. This is a fairly generic message extension that searches npm packages. In this lab, you'll learn how to brand your application, use it to call an enterprise web service, and update it to send an adaptive card instead of a simpler Hero card.

## Features

- App will be listed as Northwind Suppliers with an appropriate app logo
- App will query the Northwind Suppliers database and allow searching for suppliers by name
- When a supplier is selected, the app will insert an adaptive card into the conversation

## Exercise 1: Update the App Manifest

### Step 1: Download new app icons and place them in the **appPackage** folder.

 * The large icon should be in color and 192x192 pixels:
   [northwind-suppliers-192.png](){target="_blank"} 

    <img src="/app-camp/assets/new-adventure/northwind-suppliers-192.png" alt="Large icon" width="192" height="192" />

 * The small icon should be monochrome and 32x32 pixels:
   [northwind-suppliers-32.png](){target="_blank"} 

    <img src="/app-camp/assets/new-adventure/northwind-suppliers-32.png" alt="Large icon" width="32" height="32" />

### Step 2: Update the **manifest.json** file

Close the browser to stop debugging your project. Then, in Visual Studio Code, open the Teams manifest template, **manifest.json**, which is also in the **appPackage** folder. Replace the icon file names with the new file names.

```json
"icons": {
    "color": "northwind-suppliers-192.png",
    "outline": "northwind-suppliers-32.png"
},
```

Scroll down and update the name and description fields in the manifest; these will be shown to users when they view your application in Teams. Note that the token ${{TEAMSFX_ENV}}` be expanded to indicate the Teams Toolkit current development environment, which is currently "LOCAL". Later if you wish you can create additional environments such as "DEV", "STAGING", etc.

```json
"name": {
    "short": "Northwind Suppliers-${{TEAMSFX_ENV}}",
    "full": "Northwind Suppliers - Teams App Camp New Adventure"
},
"description": {
    "short": "Access and share Northwind data in Microsoft Teams",
    "full": "Sample application from Teams App Camp, New Adventure"
},
```

While you're there, change the accent color to a lighter shade of blue in the same hue as the large icon:

```json
"accentColor": "#9EDBF9",
```

Continuing to scroll down, under `composeExtensions:` `commands:`, edit the title and description of the message extension command. These are the settings that control how the search box is presented to the user.

```json
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
    ]
```

Now start your application again. It should look a lot more "Northwindy", but of course it still just queries the npm data.

![Caption](../assets/new-adventure/Lab02-001-Install-Branded-App.png)

![Caption](../assets/new-adventure/Lab02-002-Run%20Branded%20App.png)

## Exercise 2: Add new Message Extension code

In this and the labs that follow, we'll be adding multiple different message extensions to the Northwind Suppliers application. For that reason, we'll put the code for each message extension in separate modules instead of placing it in-line in the [teamsBot.js](){target=_blank} file.

### Step 1: Add Message Extension logic

To begin, creae a folder in the **NorthwindSuppliers** directory called **messageExtensions**. Then create a new file in the **messageExtensions** folder called **supplierME.js** and copy in the following code:

```javascript
const axios = require("axios");
const ACData = require("adaptivecards-templating");
const { CardFactory } = require("botbuilder");

class SupplierME {

    // Get suppliers given a query
    async handleTeamsMessagingExtensionQuery (context, query) {

        try {
            const response = await axios.get(
                `https://services.odata.org/V4/Northwind/Northwind.svc/Suppliers` +
                `?$filter=contains(tolower(CompanyName),tolower('${query}'))` +
                `&$orderby=CompanyName&$top=8`
            );

            const attachments = [];
            response.data.value.forEach((supplier) => {

                // Free flag images from https://flagpedia.net/
                const flagUrl = this.#getFlagUrl(supplier.Country);
                const imageUrl = `https://picsum.photos/seed/${supplier.SupplierID}/300`;

                const itemAttachment = CardFactory.heroCard(supplier.CompanyName);
                const previewAttachment = CardFactory.thumbnailCard(supplier.CompanyName,
                    `${supplier.City}, ${supplier.Country}`, [flagUrl]);

                previewAttachment.content.tap = {
                    type: "invoke",
                    value: {    // Values passed to selectItem when an item is selected
                        queryType: 'supplierME',
                        SupplierID: supplier.SupplierID,
                        flagUrl: flagUrl,
                        imageUrl: imageUrl,
                        Address: supplier.Address,
                        City: supplier.City,
                        CompanyName: supplier.CompanyName,
                        ContactName: supplier.ContactName,
                        ContactTitle: supplier.ContactTitle,
                        Country: supplier.Country,
                        Fax: supplier.Fax,
                        Phone: supplier.Phone,
                        PostalCode: supplier.PostalCode,
                        Region: supplier.Region
                    },
                };
                const attachment = { ...itemAttachment, preview: previewAttachment };
                attachments.push(attachment);
            });

            return {
                composeExtension: {
                    type: "result",
                    attachmentLayout: "list",
                    attachments: attachments,
                }
            };

        } catch (error) {
            console.log(error);
        }
    };

    handleTeamsMessagingExtensionSelectItem (context, selectedValue) {

        // Read card from JSON file
        const templateJson = require('../cards/supplierCard.json');
        const template = new ACData.Template(templateJson);
        const card = template.expand({
            $root: selectedValue
        });

        const resultCard = CardFactory.adaptiveCard(card);

        return {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: [resultCard]
            },
        };

    };

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

module.exports.SupplierME = new SupplierME();
```

???+ note "Code walk-through"
    
    Here are some highlights about the code you just copied:

    - <u>`handleTeamsMessagingExtensionQuery (context, query)`</u> - This function will be called when someone types something into the search box in your message extension. That means you might get partial queries. You can also tell Teams to call your message extension as soon as the user opens it up - with an empty query - using the [`initialRun` parameter](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema#composeextensionscommands){target="_blank"} in the manifest.

        Notice that this function is calling a public web service, which is a sample [OData database](https://www.odata.org/odata-services/#3){target="_blank"} hosted by the [OData team](https://www.odata.org/){target="_blank"}]  and including an [OData filter](https://www.odata.org/getting-started/basic-tutorial/#queryData){target="_blank"} to select suppliers containing the user's query. It's worth learning OData because it's used on the [Microsoft Graph](https://developer.microsoft.com/graph){target="_blank"}, which is the server-side API for Microsoft 365 and Microsoft Teams.
    
        The function returns an array of [attachments](https://learn.microsoft.com/azure/bot-service/bot-builder-howto-add-media-attachments?view=azure-bot-service-4.0&tabs=javascript){target="_blank"}. Each of these attachments includes an `itemAttachment` (which will be shown by default if the user selects an item), a `previewAttachment`, which is shown in the search results list, and a `value` which is passed to the `handleTeamsMessagingExtensionSelectItem` when someone selects an item in the search results

    - <u>`handleTeamsMessagingExtensionSelectItem (context, selectedValue)`</u> - This function will be called when a user clicks an item in the query search results. The `value` for that item (from the previous function) is passed in, so we can hand ourselves the data we need to create the adaptive card.

        The code binds this value to the adaptive card template with this code:

            const templateJson = require('./supplierCard.json');
            const template = new ACData.Template(templateJson);
            const card = template.expand({
                $root: selectedValue
            });
            

        The function returns the adaptive card for insertion in the compose box in Microsoft Teams.

    - <u>`#getFlagUrl (country)`</u> - The cards were boring without any pictures, so this private function finds a flag image for each supplier based on its country. Thanks to [https://flagpedia.net](https://flagpedia.net){target="_blank"} for the wonderful collection of national flags!

### Step 2: Add the adaptive card file

The new message extension will use an adaptive card to display supplier data. Adaptive cards are JSON structures defining the card to be displayed; we'll use [adaptive card templating](https://learn.microsoft.com/en-us/adaptive-cards/templating/){target="_blank"} so we can keep the JSON in its own file and inject the data at runtime.

Begin by creating a new folder **cards** under the **NorthwindSuppliers** folder. Then create a file, **supplierCard.json** in the **cards** folder and paste in the following JSON:

~~~json
{
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.4",
    "body": [
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "width": "50px",
                    "verticalContentAlignment": "center",
                    "items": [
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "Image",
                                    "horizontalAlignment": "center",
                                    "url": "${flagUrl}",
                                    "altText": "${Country} flag"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "Container",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "size": "extraLarge",
                                    "weight": "lighter",
                                    "text": "${CompanyName}",
                                    "wrap": true
                                }
                            ],
                            "bleed": true
                        }
                    ]
                }
            ]
        },
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "Container",
                            "spacing": "none",
                            "style": "emphasis",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "spacing": "small",
                                    "text": "${Address}",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "none",
                                    "text": "${City} ${Region} ${PostalCode} ${Country}",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "none",
                                    "text": "${Phone}",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "large",
                                    "text": "Contact:",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "none",
                                    "text": "${ContactName}",
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "none",
                                    "text": "${ContactTitle}",
                                    "wrap": true
                                }
                            ],
                            "bleed": true,
                            "height": "stretch"
                        }
                    ],
                    "width": 45
                },
                {
                    "type": "Column",
                    "items": [
                        {
                            "type": "Container",
                            "height": "stretch",
                            "items": [
                                {
                                    "type": "ColumnSet",
                                    "columns": [
                                        {
                                            "type": "Column",
                                            "verticalContentAlignment": "center",
                                            "items": [
                                                {
                                                    "type": "Image",
                                                    "url": "${imageUrl}"
                                                }
                                            ],
                                            "width": "stretch"
                                        }
                                    ]
                                },
                                {
                                    "type": "ActionSet",
                                    "separator": true,
                                    "actions": [
                                        {
                                            "type": "Action.OpenUrl",
                                            "title": "Web site",
                                            "url": "https://adaptivecards.io"
                                        }
                                    ],
                                    "spacing": "medium"
                                }
                            ]
                        }
                    ],
                    "width": 55
                }
            ],
            "height": "stretch"
        }
    ]
}
~~~

???+ note "Code walk-through"
    Visit [https://adaptivecards.io](https://adaptivecards.io){target="_blank"} to learn all about adaptive cards. There are a ton of samples and also an [adaptive card designer](https://adaptivecards.io/designer/){target="_blank"}. The card used in this lab was created using this designer.

    The JSON includes data binding expressions using the [Adaptive Cards Template Language](https://learn.microsoft.com/adaptive-cards/templating/language){target="_blank"}. For example, the expression `${flagUrl}` inserts the value of `selectedValue.flagUrl` in the message extension code.

### Step 3: Install the adaptivecards-templating npm package

The templating won't work without the adaptive card templates library, so go to a command line and, within the **NorthwindSuppliers** folder run this command to install it.

```shell
npm install adaptivecards-templating
```

## Step 4: Update the Teams Bot

Recall that message extensions are web services that use the Azure Bot Framework to communicate with Microsoft Teams. So of course, there is a bot; Teams Toolkit generated the bot code in a file that's aptly called **teamsBot.js**.

In this step, we'll remove the call to the npm library and instead call the message extension code we just added. We'll set up a couple of switch statements that will make it easier to add more message extensions in the labs that follow.

Edit **teamsBot.js** and replace the `require` statements at the top with these:

```javascript
const { TeamsActivityHandler } = require("botbuilder");
const { SupplierME } = require("./messageExtensions/supplierME");
```

This gives us a reference to the supplierME message extension, and drops the requirement for axios and the card actory since they're being handled in the supplierME code.

Next, replace the `handleTeamsMessagingExtensionQuery()` function with this shorter version:

```javascript
  async handleTeamsMessagingExtensionQuery(context, query) {

    const queryName = query.parameters[0].name;
    const searchQuery = query.parameters[0].value;

    switch (queryName) {
      case "searchQuery":  // Search for suppliers
        return await SupplierME.query(context, searchQuery);
      default:
        return null;
    }
  }
```

Notice that the switch statement uses the `queryNamee` "searchQuery" to determine that the request is for our new SupplierME message extension. This is because the parameter `searchQuery` was specified in this message extension command back in Exercise 1 Step 2.

![Caption](../assets/new-adventure/Lab02-003-Message-extenion-parameter-name.png)

Finally, replace the `handleTeamsMessagingExtensionSelectItem()` with this version, which will dispatch SelectItem events to our message extension.

```javascript
  async handleTeamsMessagingExtensionSelectItem(context, item) {

    switch (item.queryType) {
      case "searchQuery":  // Search for suppliers
        return SupplierME.selectItem(context, item);
      default:
        return null;
    }

  }
```

## Exercise 3: Run the app



--8<-- "i-finished.md"

## Known issues

--8<-- "issuesLink.md"

## Next steps

After completing this lab, you may continue to the next lab in this learning path, [lab-name](./02-lab-something.md).

<img src="https://pnptelemetry.azurewebsites.net/app-camp/new-adventure/Lab0x" />

