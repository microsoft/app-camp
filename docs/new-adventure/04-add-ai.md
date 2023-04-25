---8<--- "heading2.md"

# Lab 4: Action message extensions with Open AI

???+ info "Lab Outline"

    * __[Lab 1 - Create your first app with Teams Toolkit](./01-create-app.md)__
    In this lab, you'll set up Teams Toolkit create a Teams message extension
    * __[Lab 2 - Integrate business data with your application](./02-integrate-web-service.md)__
    In this lab, you'll brand your new app as "Northwind Suppliers", and will provide the ability to insert data from the Northwind Traders sample database in a Microsoft Teams conversation. You'll also learn how to create and send adaptive cards with your message extension.
    * __[Lab 3 - Add link unfurling](./03-add-link-unfurling.md)__
    In this lab, you'll learn how to use Link Unfurling, which provides a custom summary when a user includes your URL in a conversation
    * __<span style="color: red;">THIS LAB:</span>
    [Lab 4 - Action message extensions with Open AI](./04-add-ai.md)__
    In this lab, you'll learn how to build "Action" message extensions which can be launched directly
    or in the context menu of another Teams message to take action on it. The labs use the Open AI
    commercial web services (in Azure or using an Open AI account) to generate messages.
    * __[Lab 5 - Single Sign-on and Microsoft Graph](./05-add-sso.md)__
    In this lab, you'll learn how to authenticate users with Azure AD Single Sign-On, and to call the
    Microsoft Graph API. This same process would be used when calling any
    web service that's secured with Azure AD on behalf of the logged-in user.

## Overview

In this lab you will learn to:

- Create an action message extension accessible from the compose box in Microsoft Teams
- Create an action message extension to take action on a message in Microsoft Teams
- Interact with users using adaptive cards in a dialog through the FetchTask and SubmitAction activities
- Call the OpenAI API for an Azure OpenAI resource or the OpenAI public web service

## Features

- An action message extension that uses Open AI to help a user compose a message in Microsoft Teams
- An action message extension that works in the context menu of an existing message to help a user compose a response to a message in Microsoft Teams

## Exercise 1: Obtain access to an OpenAI service key

There are two approaches here:

1. Set up an Azure OpenAI resource with a model such as text-davinci-003 and obtain the following information
2. Set up an account with OpenAI to access their public API

Please choose one of these approaches and follow the guidance below.

### Option 1: Use an Azure OpenAI resource

This is a good approach if you have access to an Azure subscription, and if you want to keep your data within your own Azure subscription rather than in a shared online service. [Instructions for setting it up are here](){target=_blank}.

You will need the following information about the service to access it in your application:

  * Endpoint 1️⃣ 
  * Model 2️⃣ 
  * Version
  * API Key 3️⃣ 


### Option 2: Use the OpenAI public API

This is a great and quick way to get started, especially if you can access a trial API key. You can do a lot with the $5 credit that is currently offered, however you may find that your 90-day time window has expired if you've been using ChatGPT.

  * Open AI key


--8<-- "i-finished.md"

## Known issues

--8<-- "issuesLink.md"

## Next steps

After completing this lab, you may continue to the next lab in this learning path, [lab-name](./02-lab-something.md).

<img src="https://pnptelemetry.azurewebsites.net/app-camp/new-adventure/Lab0x" />

