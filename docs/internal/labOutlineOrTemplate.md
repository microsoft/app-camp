![Teams App Camp](../../assets/code-lab-banner.png)

# Lab xxx: [Lab title]

## Overview

Describe the lab here

The completed solution can be found in the [A02-after-teams-sso](../../src/create-core-app/aad/A02-after-teams-sso/){target="_blank"} folder, but the instructions will guide you through modifying the app running in your working folder. 

In this lab you will learn to:

- first thing
- second thing
- more things

???+ info "Video briefing"
    <div class="video">
      <img src="/app-camp/assets/video-coming-soon.png"></img>
      <div>xxx Lab Briefing</div>
    </div>

??? note "Table of Contents (open to display ►)"
    - [Overview](#overview)
    - [Features](#features)
    - [Project structure](#project-structure)
    - [Exercise 1: Authorize Microsoft Teams to log users into your application](#exercise-1-authorize-microsoft-teams-to-log-users-into-your-application)
        - [Step 1: Return to your app registration](#step-1-return-to-your-app-registration)
        - [Step 2: Add the Teams client applications](#step-2-add-the-teams-client-applications)
    - [Known issues](#known-issues)
    - [References](#references)
    - [Next Steps](#next-steps)

## Features

- First feature added in the lab
- Second feature added in the lab
- ...

## Project structure

??? note "Project files before and after this lab (open to display ►)"
    The project structure when you start of this lab and end of this lab is as follows.
    Use this depiction for comparison.
    On your left is the contents of folder  `A03-after-apply-styling` and on your right is the contents of folder `xxx`.

    - 🆕 New files/folders

    - 🔺Files changed


    <table>
    <tr>
    <th >Project Structure Before </th>
    <th>Project Structure After</th>
    </tr>
    <tr>
    <td valign="top" >
    <pre>
    A03-after-apply-styling
        ├── client
        │   ├── components
        │       ├── navigation.js
        │   └── identity
        │       ├── identityClient.js
        │       └── userPanel.js
        ├── modules
        │   └── env.js
        │   └── northwindDataService.js
        │   └── teamsHelpers.js
        ├── pages
        │   └── categories.html
        │   └── categories.js
        │   └── categoryDetails.html
        │   └── categoryDetails.js
        │   └── myOrders.html
        │   └── orderDetail.html
        │   └── orderDetail.js
        │   └── privacy.html
        │   └── productDetail.html
        │   └── productDetail.js
        │   └── termsofuse.html
        ├── index.html
        ├── index.js
        ├── northwind.css
        ├── teamstyle.css
        ├── manifest
        │   └── makePackage.js
        │   └── manifest.template.json
        │   └── northwind32.png
        │   └── northwind192.png
        │   └── constants.js
        │   └── identityService.js
        │   └── northwindDataService.js
        │   └── server.js
        ├── .env_Sample
        ├── .gitignore
        ├── package.json
        └── README.md
    </pre>
    </td>
    <td>
    <pre>
    xxx (this lab) -- add 🆕 and 🔺
        ├── client
        │   ├── components
        │       ├── navigation.js
        │   └── identity
        │       ├── identityClient.js
        │       └── userPanel.js
        ├── modules
        │   └── env.js
        │   └── northwindDataService.js
        │   └── teamsHelpers.js
        ├── pages
        │   └── categories.html
        │   └── categories.js
        │   └── categoryDetails.html
        │   └── categoryDetails.js
        │   └── myOrders.html
        │   └── orderDetail.html
        │   └── orderDetail.js
        │   └── privacy.html
        │   └── productDetail.html
        │   └── productDetail.js
        │   └── termsofuse.html
        ├── index.html
        ├── index.js
        ├── northwind.css
        ├── teamstyle.css
        ├── manifest
        │   └── makePackage.js
        │   └── manifest.template.json
        │   └── northwind32.png
        │   └── northwind192.png
        │   └── constants.js
        │   └── identityService.js
        │   └── northwindDataService.js
        │   └── server.js
        ├── .env_Sample
        ├── .gitignore
        ├── package.json
        └── README.md
    </pre>
    </td>
    </tr>
    </table>

## Exercise 1: (High-level description)

### Step 1: (do a thing)

### Step 2: (do another thing)


## Known issues

--8<-- "issuesLink.md"

## References

[Single sign-on (SSO) support for Tabs](https://docs.microsoft.com/microsoftteams/platform/tabs/how-to/authentication/auth-aad-sso?WT.mc_id=m365-58890-cxa)


## Next Steps

After completing this lab, you may continue to the next lab in this learning path, [A03-after-apply-styling: Teams styling and themes](./A03-after-apply-styling.md){target="_blank"}.
