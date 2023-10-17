import {
    CardFactory,
    TurnContext,
    MessagingExtensionQuery,
    MessagingExtensionResponse,
} from "botbuilder";
import { Product } from "../northwindDB/model";
import { getProducts } from "../northwindDB/products";


async function handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
): Promise<MessagingExtensionResponse> {
    const searchQuery = query.parameters[0].value;

    const products = await getProducts(searchQuery);

    const attachments = [];
    products.forEach((product) => {
        const adaptiveCard = CardFactory.adaptiveCard({
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            type: "AdaptiveCard",
            version: "1.4",
            body: [
                {
                    type: "TextBlock",
                    text: `${product.ProductName}`,
                    wrap: true,
                    size: "Large",
                },
                {
                    type: "TextBlock",
                    text: `${product.ProductID}`,
                    wrap: true,
                    size: "medium",
                },
            ],
        });
        const preview = CardFactory.heroCard(product.ProductName);
        const attachment = { ...adaptiveCard, preview };
        attachments.push(attachment);
    });

    return {
        composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
        },
    };
}

export default { handleTeamsMessagingExtensionQuery }
