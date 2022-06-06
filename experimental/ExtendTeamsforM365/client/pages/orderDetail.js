import { getOrder} from '../modules/northwindDataService.js';
import chatCard from '../cards/orderChatCard.js';
import orderTrackerCard from '../cards/orderTrackerCard.js';
import mailCard from '../cards/orderMailCard.js';
import { env } from '/modules/env.js';
import { ensureTeamsSdkInitialized } from '../modules/teamsHelpers.js';
async function displayUI() {
    let orderDetails = {};
    const displayElement = document.getElementById('content');
    const detailsElement = document.getElementById('orderDetails');
    try {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('orderId')) {
            const orderId = searchParams.get('orderId');
            const order = await getOrder(orderId);
            orderDetails.orderId = orderId ? orderId : "";
            orderDetails.contact = order.contactName && order.contactTitle ? `${order.contactName}(${order.contactTitle})` : "";
            //get from graph, for use env config with other users in your AAD
            orderDetails.salesRepEmail =env.CONTACTS.indexOf(',') > -1?env.CONTACTS.split(','):[env.CONTACTS];
            orderDetails.salesRepMailrecipients =env.CONTACTS.replace(',',';');
            displayElement.innerHTML = `
                    <h2>Order details for ${order.orderId}</h2>
                    <p><b>Customer:</b> ${order.customerName}<br />
                    <b>Contact:</b> ${order.contactName}, ${order.contactTitle}<br />
                    <b>Date:</b> ${new Date(order.orderDate).toDateString()}<br />
                    <b> ${order.employeeTitle}</b>: ${order.employeeName} (${order.employeeId})
                    </p>
                `;
            order.details.forEach(item => {
                const orderRow = document.createElement('tr');
                orderRow.innerHTML = `<tr>
                        <td>${item.quantity}</td>
                        <td><a href="/pages/productDetail.html?productId=${item.productId}">${item.productName}</a></td>
                        <td>${item.unitPrice}</td>
                        <td>${item.discount}</td>
                    </tr>`;
                detailsElement.append(orderRow);

            });
            //show tracker element for each order
            const trackerArea = document.getElementById('trackerBox');
            trackerArea.style.display = "block";
            var template = new ACData.Template(orderTrackerCard);
            var card = template.expand({ $root: orderDetails });
            var adaptiveCard = new AdaptiveCards.AdaptiveCard();           
            adaptiveCard.parse(card);
            trackerArea.appendChild(adaptiveCard.render()); 
              if(await ensureTeamsSdkInitialized()) {
             //chat support
            if(microsoftTeams.chat.isSupported()) { 

                //show chat view
                const chatArea = document.getElementById("chatBox");
                chatArea.style.display = "block";

                //adaptive card templating
                var template = new ACData.Template(chatCard);
                var card = template.expand({ $root: orderDetails });
                var adaptiveCard = new AdaptiveCards.AdaptiveCard();

                //button action for chat
                adaptiveCard.onExecuteAction = async action => {                  
                    if (orderDetails.salesRepEmail.length > 1) { 

                        //group chat                                    
                        await microsoftTeams.chat
                            .openGroupChat({
                                users:orderDetails.salesRepEmail,
                                topic:`Enquiry about order ${orderDetails.orderId}`,
                                message:`Hi, to discuss about ${orderDetails.orderId}`
                            });
                    } else {

                        //1:1 chat
                       await microsoftTeams.chat
                            .openChat({
                                user:orderDetails.salesRepEmail[0],                            
                                message:`Enquiry about order ${orderDetails.orderId}`
                            });
                    }
                }
                adaptiveCard.parse(card);
                chatArea.appendChild(adaptiveCard.render());

            } else if (microsoftTeams.mail.isSupported()) {
                 
                //show mail view
                const mailArea = document.getElementById("mailBox");
                mailArea.style.display = "block";

                //adaptive card templating
                var template = new ACData.Template(mailCard);
                var card = template.expand({ $root: orderDetails });
                var adaptiveCard = new AdaptiveCards.AdaptiveCard();

                //button action for new mail
                adaptiveCard.onExecuteAction = action => {
                    microsoftTeams.mail.composeMail({
                        type: microsoftTeams.mail.ComposeMailType.New,
                        subject: `Enquire about order ${orderDetails.orderId}`,
                        toRecipients: [orderDetails.salesRepMailrecipients],
                        message: "Hello",
                    });
                }

                adaptiveCard.parse(card);
                mailArea.appendChild(adaptiveCard.render());
            }else{
                message.innerText = `Error: chat/mail not supported`;
            }
        }
        }
    }
    catch (error) {            // If here, we had some other error
        message.innerText = `Error: ${JSON.stringify(error)}`;
    }
}

//display the tab for order details
displayUI();

