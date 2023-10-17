const productME = require("./MessageExtensions/productME.js");

const axios = require("axios");
const querystring = require("querystring");
const { TeamsActivityHandler, CardFactory } = require("botbuilder");

class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Message extension Code
  // Search.
  async handleTeamsMessagingExtensionQuery(context, query) {

    // TODO: How to best distinguish with multiple params?
    const me = query.parameters[0].name;
    switch (me) {
      case "searchQuery": {
        return productME.handleTeamsMessagingExtensionQuery(context, query);
      }
    }
  }
}

module.exports.SearchApp = SearchApp;
