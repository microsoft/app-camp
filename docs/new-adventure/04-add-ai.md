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

For example, here is the Reply message extension in action. An adaptive card is used to interact with the user and allow a response in agreement, disagreement, poem, or a joke.

![A dialog box showing a form allowing the user to choose how to reply to a message](../assets/new-adventure/Lab04-009-Reply4.png)

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

Open a terminal window in Visual Studio Code or in your local operating system, and navigate to your **NorthwindSuppliers** project folder. Then type this command:

~~~sh
npm install openai
~~~

## Exercise 3: Add Action message extensions to the Teams manifest

OK now that we have an AI service to build on, let's create the message extensions. There will be two of them: one that generates a new message and is accessible from a button next to the compose box pop-up, and the other replies to a message and is accessible from the context menu of a message.

Open **appPackage/manifest.json** in your code editor and add these two elements to the `commands` array within `composeExtensions`:

~~~json
    {
        "id": "generateMessage",
        "context": [
            "compose",
            "commandBox"
        ],
        "description": "Generate a message using AI",
        "title": "Generate message",
        "type": "action",
        "fetchTask": true
    },
    {
        "id": "replyToMessage",
        "context": [
            "message"
        ],
        "description": "Generate an agreeable response",
        "title": "AI Reply",
        "type": "action",
        "fetchTask": true
    }
~~~

!!! note
    If all the indentation is a bit confusing, feel free to copy the entire updated **manifest.json** file [from here](https://github.com/microsoft/app-camp/tree/BG-NewLabs/src/teams-toolkit/Lab04-add-ai/NorthwindSuppliers/appPackage/manifest.json){target=_blank}

Notice that the new commands are both of type `action`, with `fetchTask` set to `true`. This will cause Teams to display a dialog containing a web page or adaptive card when the action is invoked. In this case, we'll use an adaptive card.

Also notice that the `generateMessage` action runs in the context of the `compose` box or `commandBox` at the top of the Teams user interface. `replyToMessage` runs in the context of a `message`.

## Exercise 4: Add a message extension to generate a message

### Step 1: Add JavaScript code

Now, as before, we'll make a separate JavaScript module for each of our message extensions. Create a new file called **generateMessageME.js** in the **messageExtensions** folder. Paste this code into the file:

~~~javascript

const ACData = require("adaptivecards-templating");
const { CardFactory } = require("botbuilder");
const { OpenAiService } = require("../services/azureOpenAiService");
// const { OpenAiService } = require("../services/openAiService");

class GenerateMessageME {

    // Ref documentation
    // https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/action-commands/define-action-command

    async fetchTask (context, action) {
        try {
            return this.#getMessageFormResponse("Please generate a message for me to send.");
        } catch (e) {
            console.log(e);
        }
    }

    async submit (context, action) {

        try {

            switch (action.data?.intent) {
                case "send": {
                    return await this.#getSendMessageResponse(action.data?.message);
                }
                default: {
                    return await this.#getMessageFormResponse(action.data?.prompt);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    // Generate a message given a prompt from the user
    async #getMessageFormResponse (prompt) {

        const text = await OpenAiService.generateMessage(prompt);

        // Read card from JSON file
        const templateJson = require('./generateMessageCard.json');
        const template = new ACData.Template(templateJson);
        const cardContents = template.expand({
            $root: {
                prompt: prompt,
                message: text
            }
        });

        const card = CardFactory.adaptiveCard(cardContents);
        return {
            task: {
                type: 'continue',
                value: {
                    card: card,
                    height: 400,
                    title: `Generate a message`,
                    width: 300
                }
            }
        };
    }

    async #getSendMessageResponse (message) {

        const messageHtml = message.replace(/\n/g, "<br />");

        const heroCard = CardFactory.heroCard('', messageHtml);
        const attachment = {
            contentType: heroCard.contentType,
            content: heroCard.content,
            preview: heroCard
        };

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: [
                    attachment
                ]
            }
        };
    }

}

module.exports.GenerateMessageME = new GenerateMessageME();
~~~

!!! warning "Adjust if using the OpenAI platform service"
    If you're using Azure OpenAI, then this code is ready to go. If you're using the public OpenAI platform, then you need to comment out the `require` statement for `/services/azureOpenAiService` and un-comment the one for `/services/openAiService`.

???+ note "Code walk-through"
    Take a moment to examine the code you just added.

    The `fetchTask()` function is called when the action message extension is invoked
    by a user. This function will return an adaptive card as part of a "continue" task, which tells Teams to display the card and continue to interact with the user. The code to generate the adaptive card is in a function `#getMessageFormResponse()` because it's used repeatedly if the user clicks the "Generate" button on the card.

    When the user clicks a button on the adaptive card, the card data is submitted and the `submit()` function is called. If the `send` button was pressed, the code returns a `result` response with a hero card containing the message to be sent; this inserts the generated message into the compose box for the user to send.

### Step 2: Add the adaptive card

Add a new file, **generateMessageCard.js** in the **cards** folder you created in Lab 2. Paste this JSON into the file.

~~~json
{
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.4",
    "body": [
        {
            "type": "Input.Text",
            "label": "Enter a prompt here",
            "isMultiline": true,
            "value": "${prompt}",
            "id": "prompt"
        },
        {
            "type": "ActionSet",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Generate",
                    "data": {
                        "intent": "generate"
                    }
                }
            ]
        },
        {
            "type": "Input.Text",
            "label": "Edit your message here",
            "isMultiline": true,
            "value": "${message}",
            "id": "message"
        }
    ],
    "actions": [
        {
            "type": "Action.Submit",
            "title": "Send response",
            "data": {
                "intent": "send"
            }
        }
    ]
}
~~~

???+ note "Code walk-through"
    This is what the card will look like when it's displayed:
    ![Caption](../assets/new-adventure/Lab04-002-Generate2.png)
    
    Notice there are 2 buttons, "Generate" and "Send" on the card. These correspond to the 2 `Action.Submit` actions in the card JSON. These will both cause the `handleTeamsMessagingExtensionSubmitAction()` event to fire in the bot, which will call the corresponding function in **generateMessageME.js**. So how will the message extension determine which button was pressed?

    The answer is that the actions each submit a bit more data in addition to the input fields on the card. The first `Action.Submit` sends an `intent` property value of `"generate"` and the second one sends an `intent` value of `"send"`; the code in **generateMessageME.js** will use this value to figure out which button was pressed.

## Exercise 5: Add a message extension to reply to a message

~~~javascript

const ACData = require("adaptivecards-templating");
const { CardFactory } = require("botbuilder");
const { OpenAiService } = require("../services/azureOpenAiService");
// const { OpenAiService } = require("../services/openAiService");


class ReplyME {

    // Ref documentation
    // https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/action-commands/define-action-command

     async fetchTask (context, action) {
        try {

            const [message, replyType] = this.#getMessageAndReplyType(action);
            return this.#getReplyFormResponse(message, replyType);

        } catch (e) {
            console.log(e);
        }
    }

    async submit (context, action) {

        try {

            const [message, replyType] = this.#getMessageAndReplyType(action);

            switch (action.data?.intent) {
                case "send": {
                    return await this.#getSendMessageResponse(action.data?.replyText);
                }
                default: {
                    return this.#getReplyFormResponse(message, replyType);
                }
            }

        }

        catch (e) {
            console.log(e);
        }
    }

    #getMessageAndReplyType (action) {
        let message = action.messagePayload?.body?.content;
        const messageType = action.messagePayload?.body?.contentType;
        if (messageType === "html") {
            message = message.replace(/<[^>]*>?/gm, '');
        }

        return [message, action.data?.replyType || "agree"];
    }

    async #getReplyFormResponse (message, replyType) {

        const prompt = OpenAiService.getPrompt(message, replyType);
        const replyText = await OpenAiService.generateMessage(prompt);

        // Read card from JSON file
        const templateJson = require('./replyCard.json');
        const template = new ACData.Template(templateJson);
        const cardContents = template.expand({
            $root: {
                message: message,
                replyText: replyText,
                replyType: replyType
            }
        });

        const card = CardFactory.adaptiveCard(cardContents);
        return {
            task: {
                type: 'continue',
                value: {
                    card: card,
                    height: 500,
                    title: `Reply to message`,
                    width: 400
                }
            }
        };

    }

    async #getSendMessageResponse (messageText) {

        const messageHtml = messageText.replace(/\n/g, "<br />");

        const heroCard = CardFactory.heroCard('', messageHtml);
        const attachment = {
            contentType: heroCard.contentType,
            content: heroCard.content,
            preview: heroCard
        };

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: [
                    attachment
                ]
            }
        };
    }

}

module.exports.ReplyME = new ReplyME();
~~~

!!! warning "Adjust if using the OpenAI platform service"
    If you're using Azure OpenAI, then this code is ready to go. If you're using the public OpenAI platform, then you need to comment out the `require` statement for `/services/azureOpenAiService` and un-comment the one for `/services/openAiService`.

???+ note "Code walk-through"
    Take a moment to examine the code you just added.

    The `fetchTask()` function is called when the action message extension is invoked
    by a user. This function will retrieve the 


## Exercise 6: Update the bot code to call the message extensions

## Exercise 7: Run the solution

--8<-- "i-finished.md"

## Next steps

After completing this lab, you may continue to the next lab in this learning path, [Lab 5 - Single Sign-on and Microsoft Graph](./05-add-sso.md).

## Known issues

--8<-- "issuesLink.md"

<img src="https://pnptelemetry.azurewebsites.net/app-camp/new-adventure/Lab0x" />

