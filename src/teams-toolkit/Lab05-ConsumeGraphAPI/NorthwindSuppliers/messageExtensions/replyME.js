const ACData = require("adaptivecards-templating");
const { CardFactory } = require("botbuilder");
const { OpenAiService } = require("../services/azureOpenAiService");
// const { OpenAiService } = require("../services/openAiService");


class ReplyME {

    // Ref documentation
    // https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/action-commands/define-action-command

    async handleTeamsMessagingExtensionFetchTask(context, action) {
        try {

            const userMessage = this.#getUserMessage(action);
            return this.#displayAdaptiveCardResponse(userMessage, "agree");

        } catch (e) {
            console.log(e);
        }
    }

    async handleTeamsMessagingExtensionSubmitAction(context, action) {

        try {

            const userMessage = this.#getUserMessage(action);
            const replyType = action.data?.replyType;

            switch (action.data?.intent) {
                case "send": {
                    return await this.#sendMessageResponse(action.data?.replyText);
                }
                default: {
                    return this.#displayAdaptiveCardResponse(userMessage, replyType);
                }
            }

        }

        catch (e) {
            console.log(e);
        }
    }

    // Get the original message the user invoked the ME on and also the type
    // of response indicated in the adaptive card (agree, disagree, poem, or joke).
    // Default to "agree" if we're displaying the 1st adaptive card
    #getUserMessage(action) {
        let userMessage = action.messagePayload?.body?.content;
        const messageType = action.messagePayload?.body?.contentType;
        if (messageType === "html") {
            userMessage = userMessage.replace(/<[^>]*>?/gm, '');
        }

        return userMessage;
    }

    // Generate a response that will display the adaptive card form in Teams
    async #displayAdaptiveCardResponse(message, replyType) {

        const prompt = this.#getPrompt(message, replyType);
        const replyText = await OpenAiService.generateMessage(prompt);

        // Read card from JSON file
        const templateJson = require('../cards/replyCard.json');
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

    // Generate a response that will add a message to the Teams compose box
    async #sendMessageResponse(messageText) {

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

    // Get the OpenAI prompt based on the user message and reply type
    #getPrompt(userMessage, replyType) {

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
}

module.exports.ReplyME = new ReplyME();