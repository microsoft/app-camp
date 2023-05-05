const axios = require("axios");
const ACData = require("adaptivecards-templating");
const { CardFactory } = require("botbuilder");

const {
    createMicrosoftGraphClientWithCredential,
    OnBehalfOfUserCredential,
    handleMessageExtensionQueryWithSSO
} = require("@microsoft/teamsfx");
require("isomorphic-fetch");

const oboAuthConfig = {
    authorityHost: process.env.M365_AUTHORITY_HOST,
    clientId: process.env.M365_CLIENT_ID,
    tenantId: process.env.M365_TENANT_ID,
    clientSecret: process.env.M365_CLIENT_SECRET,
};
const initialLoginEndpoint = process.env.INITIATE_LOGIN_ENDPOINT;

class ContactME {

    // Get contacts given a query
    async handleTeamsMessagingExtensionQuery (context, query) {
        return await handleMessageExtensionQueryWithSSO(context, oboAuthConfig, initialLoginEndpoint,
            "Contacts.Read",
            async (token) => {
              return await this.#queryContacts(context, query, token);
            });
    }

    // Get contacts given a query and an access token for the Microsoft Graph
    async #queryContacts (context, query, token) {

        try {

            // Init OnBehalfOfUserCredential instance with SSO token
            const credential = new OnBehalfOfUserCredential(token.ssoToken, oboAuthConfig);

            // Add scope for your Azure AD app. For example: Mail.Read, etc.
            const graphClient = createMicrosoftGraphClientWithCredential(credential, "Contacts.Read");

            // Call graph api use `graph` instance to get user profile information.
            const response = await graphClient.api("/me/contacts?$select=id,displayName,emailAddresses").get();

            // Since Graph doesn't allow sorting and filtering of contacts, do it here
            // TODO: Handle multiple pages of contacts
            let contacts = response.value.filter( contact => 
                contact.displayName.toLowerCase().includes(query.toLowerCase()));

            // Sort contacts by display name
            contacts = contacts.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);

            const attachments = [];
            contacts.forEach((contact) => {

                const itemAttachment = CardFactory.heroCard(contact.displayName,);
                const previewAttachment = CardFactory.thumbnailCard(contact.displayName);

                previewAttachment.content.tap = {
                    type: "invoke",
                    value: {    // Values passed to selectItem when an item is selected
                        queryType: 'contactME',
                        id: contact.id,
                        displayName: contact.displayName,
                        email: contact.emailAddresses[0]?.address
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

    handleTeamsMessagingExtensionSelectItem (context, item) {

        const resultCard = CardFactory.heroCard(item.displayName, item.email);

        return {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: [resultCard]
            },
        };
    };
}

module.exports.ContactME = new ContactME();