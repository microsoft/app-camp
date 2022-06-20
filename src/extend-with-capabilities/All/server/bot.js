import { TeamsActivityHandler, CardFactory } from 'botbuilder';
import { getProductByName, updateProductUnitStock } from './northwindDataService.js';
import * as ACData from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";
import pdtCardPayload from './cards/productCard.js'
import successCard from './cards/stockUpdateSuccess.js';
import errorCard from './cards/errorCard.js'
export class StockManagerBot extends TeamsActivityHandler {
    constructor() {
        super();
        // Registers an activity event handler for the message event, emitted for every incoming message activity.
        this.onMessage(async (context, next) => {
            console.log('Running on Message Activity.');
            await next(); //go to the next handler 
        });
    }
    //When you perform a search from the message extension app
    async handleTeamsMessagingExtensionQuery(context, query) {
        const { name, value } = query.parameters[0];
        if (name !== 'productName') {
            return;
        }

        const products = await getProductByName(value);
        const attachments = [];

        for (const pdt of products) {
            const heroCard = CardFactory.heroCard(pdt.productName);
            const preview = CardFactory.heroCard(pdt.productName);
            preview.content.tap = {
                type: 'invoke', value: {
                    productName: pdt.productName,
                    productId: pdt.productId, unitsInStock: pdt.unitsInStock, categoryId: pdt.categoryId
                }
            };
            const attachment = { ...heroCard, preview };
            attachments.push(attachment);
        }

        var result = {
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: attachments
            }
        };

        return result;

    }
    //on preview tap of an item from the list of search result items
    async handleTeamsMessagingExtensionSelectItem(context, pdt) {
        const preview = CardFactory.thumbnailCard(pdt.productName);
        var template = new ACData.Template(pdtCardPayload);
        const imageGenerator = Math.floor((pdt.productId / 1) % 10);
        const imgUrl = `https://${process.env.HOST_NAME}/images/${imageGenerator}.PNG`
        var card = template.expand({
            $root: {
                productName: pdt.productName, unitsInStock: pdt.unitsInStock,
                productId: pdt.productId, categoryId: pdt.categoryId, imageUrl: imgUrl
            }
        });
        var adaptiveCard = new AdaptiveCards.AdaptiveCard();
        adaptiveCard.parse(card);
        const adaptive = CardFactory.adaptiveCard(card);
        const attachment = { ...adaptive, preview };
        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'grid',
                attachments: [attachment]
            },
        };
    }
    //on every activity 
    async onInvokeActivity(context) {
        let runEvents = true;
        try {
            if (!context.activity.name && context.activity.channelId === 'msteams') {
                return await this.handleTeamsCardActionInvoke(context);
            } else {
                switch (context.activity.name) {
                    case 'composeExtension/query':
                        return this.createInvokeResponse(
                            await this.handleTeamsMessagingExtensionQuery(context, context.activity.value)
                        );

                    case 'composeExtension/selectItem':
                        return this.createInvokeResponse(
                            await this.handleTeamsMessagingExtensionSelectItem(context, context.activity.value)
                        );
                    case 'adaptiveCard/action':
                        const request = context.activity.value;

                        if (request) {
                            if (request.action.verb === 'ok') {

                                const data = request.action.data;
                                await updateProductUnitStock(data.pdtId, data.txtStock);
                                var template = new ACData.Template(successCard);
                                const imageGenerator = Math.floor((data.pdtId / 1) % 10);
                                const imgUrl = `https://${process.env.HOST_NAME}/images/${imageGenerator}.PNG`
                                var card = template.expand({
                                    $root: {
                                        productName: data.pdtName, unitsInStock: data.txtStock,
                                        imageUrl: imgUrl
                                    }
                                });
                                var responseBody = { statusCode: 200, type: "application/vnd.microsoft.card.adaptive", value: card }
                                return this.createInvokeResponse(responseBody);


                            } else if (request.action.verb === 'refresh') {
                                //refresh card
                            } else {
                                var responseBody = { statusCode: 200, type: "application/vnd.microsoft.card.adaptive", value: errorCard }
                                return this.createInvokeResponse(responseBody);

                            }

                        }
                    default:
                        runEvents = false;
                        return super.onInvokeActivity(context);

                }
            }
        } catch (err) {
            if (err.message === 'NotImplemented') {
                return { status: 501 };
            } else if (err.message === 'BadRequest') {
                return { status: 400 };
            }
            throw err;
        } finally {
            if (runEvents) {
                this.defaultNextEvent(context)();
            }
        }
    }


    defaultNextEvent = (context) => {
        const runDialogs = async () => {
            await this.handle(context, 'Dialog', async () => {
                // noop
            });
        };
        return runDialogs;
    }

    createInvokeResponse(body) {
        return { status: 200, body };
    }

}




