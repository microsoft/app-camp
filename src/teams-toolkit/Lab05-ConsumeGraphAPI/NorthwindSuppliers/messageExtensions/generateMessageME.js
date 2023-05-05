const ACData = require("adaptivecards-templating");
const { CardFactory } = require("botbuilder");
const { OpenAiService } = require("../services/azureOpenAiService");
// const { OpenAiService } = require("../services/openAiService");

class GenerateMessageME {

    // Ref documentation
    // https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/action-commands/define-action-command

    async handleTeamsMessagingExtensionFetchTask (context, action) {
        try {
            return this.#displayAdaptiveCardResponse("Please generate a message for me to send.");
        } catch (e) {
            console.log(e);
        }
    }

    async handleTeamsMessagingExtensionSubmitAction (context, action) {

        try {

            switch (action.data?.intent) {
                case "send": {
                    return await this.#sendMessageResponse(action.data?.message);
                }
                default: {
                    return await this.#displayAdaptiveCardResponse(action.data?.prompt);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    // Generate a response that will display the adaptive card form in Teams
    async #displayAdaptiveCardResponse (prompt) {

        const text = await OpenAiService.generateMessage(prompt);

        // Read card from JSON file
        const templateJson = require('../cards/generateMessageCard.json');
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

    // Generate a response that will add a message to the Teams compose box
    async #sendMessageResponse (message) {

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