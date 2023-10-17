import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
} from "botbuilder";
import productSearchME from "./messageExtensions/productSearchME";

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search.
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {

    const meName = query.parameters[0].name;
    switch (meName) {
      case "productName": {
        return productSearchME.handleTeamsMessagingExtensionQuery(context, query);
      }
    }

  }
}
