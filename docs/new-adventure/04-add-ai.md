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

## Exercise 1: Obtain an OpenAI API key and the code to call OpenAI

There are two approaches here:

1. Set up an Azure OpenAI resource with a model such as text-davinci-003 and obtain the following information
2. Set up an account with OpenAI to access their public API

Please choose one of these approaches and follow the guidance below.

### Option 1: Use an Azure OpenAI resource

This is a good approach if you have access to an Azure subscription, and if you want to keep your data within your own Azure subscription rather than in a shared online service. [Instructions for setting it up are here](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service){target=_blank}.

Once your Azure resource is running, you'll need the following information about the service to access it in your application:

  * Endpoint 1️⃣ - This is assigned when you create the OpenAI resource
  * Model 2️⃣ - Create an AI model deployment; the model text-davinci-003 works well for this lab. You need the "Model deployment name" from the left column in the list of model deployments.
  * Version - This is the API version; use "2023-03-15-preview" for now
  * API Key 3️⃣ - Obtain an API key 

Next, edit your **env/.env.local** file and add the following lines, filling in the information above.

~~~text
AZURE_OPENAI_BASE_PATH=https://something.openai.azure.com/openai
AZURE_OPENAI_MODEL=text-davinci-003
AZURE_OPANAI_API_VERSION=2023-03-15-preview
AZURE_OPENAI_API_KEY=xxxxxxxxxxxxxxx
~~~

Now let's add code to call the Azure OpenAI service. Create a folder **services** within the **bot** folder in your project. In this new folder, create a file **azureOpenAiService.js** and paste in this code:

~~~javascript
const { Configuration, OpenAIApi } = require("openai");

class AzureOpenAiService {
    #configuration;

    constructor() {

        this.#configuration = new Configuration({
            basePath: process.env.AZURE_OPENAI_BASE_PATH +
                "/deployments/" + process.env.AZURE_OPENAI_MODEL
        });
        this.openAiClient = new OpenAIApi(this.#configuration);
    }

    getPrompt(userMessage, replyType) {

        switch (replyType) {
            case "agree": {
                return `Please generate an agreeable response to the following message: "${userMessage}"`;
            }
            case "disagree": {
                return `Please generate a polite response in disagreement to the following message: "${userMessage}"`;
            }
            case "poem": {
                return `Please generate a short poem in response to the following message: "${userMessage}"`;
            }
            case "joke": {
                return `Please generate a dad joke in response to the following message: "${userMessage}"`;
            }
            default: {
                return `Please respond to the following message: "${userMessage}"`;
            }
        }
    }

    async generateMessage(prompt) {

        try {

            const response = await this.openAiClient.createCompletion({
                prompt: prompt,
                temperature: 0.0,
                max_tokens: 400
            }, {
                headers: {
                    'api-key': process.env.AZURE_OPENAI_API_KEY,
                  },
                  params: { "api-version": process.env.AZURE_OPANAI_API_VERSION }
            });

            let result = response.data.choices[0].text;

            return result.trim();

        } catch (e) {

            console.log(`Error ${e.response.sttus} ${e.response.statusText}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new AzureOpenAiService();
~~~

### Option 2: Use the OpenAI Platform

This is a good approach if you want to obtain [AI service directly from OpenAI](https://platform.openai.com/){target=_blank}, and is a quick way to get started with an OpenAI trial account. You'll need to [obtain an API key](https://platform.openai.com/account/api-keys){target=_blank} to use the service. Note that if you've been using Chat GPT for a while your trial API access may already have expired; visit the [usage page](https://platform.openai.com/account/usage){target=_blank} to check your status.

All you need for the lab is an OpenAI API key. Edit your **env/.env.local** file and add the following line with your API key:

~~~text
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxx
~~~

Now let's add code to call the OpenAI service. Create a folder **services** within the **bot** folder in your project. In this new folder, create a file **openAiService.js** and paste in this code:

~~~javascript
const { Configuration, OpenAIApi } = require("openai");

class OpenAiService {
    #configuration;

    constructor() {
        this.#configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.openAiClient = new OpenAIApi(this.#configuration);
    }

    getPrompt(userMessage, replyType) {

        switch (replyType) {
            case "agree": {
                return `Please generate an agreeable response to the following message: "${userMessage}"`;
            }
            case "disagree": {
                return `Please generate a polite response in disagreement to the following message: "${userMessage}"`;
            }
            case "poem": {
                return `Please generate a short poem in response to the following message: "${userMessage}"`;
            }
            case "joke": {
                return `Please generate a dad joke in response to the following message: "${userMessage}"`;
            }
            default: {
                return `Please respond to the following message: "${userMessage}"`;
            }
        }
    }

    async generateMessage(prompt) {

        try {

            const response = await this.openAiClient.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.6,
                max_tokens: 100
            });

            let result = response.data.choices[0].text;

            return result.trim();

        } catch (e) {

            console.log(`Error ${e.response.sttus} ${e.response.statusText}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new OpenAiService();
~~~

???+ note "Code walk-through"
  You might notice that the Azure OpenAI and OpenAI services are very similar. They both have `generateMessage()` functions that call openAiClient.createCompletion() with a prompt, and receive a response from the AI model. They also both have some super simple prompt generation code to allow the user to generate different kinds of responses to a message in Microsoft Teams.

## Exercise 2: Install the Open AI API package

In the previous exercise, you added code that uses the OpenAI API, but we haven't installed the npm module for it. The same module works for both Azure OpenAI and the OpenAI Platform.

Open a terminal window in Visual Studio Code or in your local operating system, and navigate to the **bot** directory within your project folder. Type this command to install the package:

~~~sh
npm install openai
~~~

## Exercise 3: Add Action message extensions to the Teams manifest

## Exercise 4: Add a message extension to generate a message

## Exercise 5: Add a message extension to reply to a message

## Exercise 6: Update the bot code to call the message extensions

## Exercise 7: Run the solution


--8<-- "i-finished.md"

## Known issues

--8<-- "issuesLink.md"

## Next steps

After completing this lab, you may continue to the next lab in this learning path, [lab-name](./02-lab-something.md).

<img src="https://pnptelemetry.azurewebsites.net/app-camp/new-adventure/Lab0x" />

