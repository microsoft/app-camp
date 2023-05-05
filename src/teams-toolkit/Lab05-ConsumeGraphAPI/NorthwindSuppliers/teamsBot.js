const { TeamsActivityHandler } = require("botbuilder");
const { SupplierME } = require("./messageExtensions/supplierME");
const { GenerateMessageME } = require("./messageExtensions/generateMessageME");
const { ReplyME } = require("./messageExtensions/replyME");
const { ContactME } = require("./messageExtensions/contactME");

class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Message extension Code
  // Search.
  async handleTeamsMessagingExtensionQuery(context, query) {

    const queryName = query.parameters[0].name;
    const searchQuery = query.parameters[0].value;

    switch (queryName) {
      case "searchQuery":  // Search for suppliers
        return await SupplierME.handleTeamsMessagingExtensionQuery(context, searchQuery);
      case "contactME":  // Search for contacts
        return await ContactME.handleTeamsMessagingExtensionQuery(context, searchQuery);
      default:
        return null;
    }
  }

  async handleTeamsMessagingExtensionSelectItem(context, item) {

    switch (item.queryType) {
      case "supplierME":  // Search for suppliers
        return SupplierME.handleTeamsMessagingExtensionSelectItem(context, item);
      case "contactME":  // Search for contacts
        return ContactME.handleTeamsMessagingExtensionSelectItem(context, item);
      default:
        return null;
    }
  }

  async handleTeamsAppBasedLinkQuery(context, query) {
    
    return NorthwindLinkME.handleTeamsAppBasedLinkQuery(context, query);

  }

  async handleTeamsMessagingExtensionFetchTask(context, action) {

    switch (action.commandId) {
      case "generateMessage": {
        return await GenerateMessageME.handleTeamsMessagingExtensionFetchTask(context, action);
      }
      case "replyToMessage": {
        return await ReplyME.handleTeamsMessagingExtensionFetchTask(context, action);
      }
      default: {
        return null;
      }
    }
  }

  async handleTeamsMessagingExtensionSubmitAction(context, action) {

    switch (action.commandId) {
      case "generateMessage": {
        return await GenerateMessageME.handleTeamsMessagingExtensionSubmitAction(context, action);
      }
      case "replyToMessage": {
        return await ReplyME.handleTeamsMessagingExtensionSubmitAction(context, action);
      }
      default: {
        return null;
      }
    }
  }
}

module.exports.TeamsBot = TeamsBot;
