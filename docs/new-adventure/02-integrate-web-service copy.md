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

## Exercise 2: 


--8<-- "i-finished.md"

## Known issues

--8<-- "issuesLink.md"

## Next steps

After completing this lab, you may continue to the next lab in this learning path, [lab-name](./02-lab-something.md).

<img src="https://pnptelemetry.azurewebsites.net/app-camp/new-adventure/Lab0x" />

