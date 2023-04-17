import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import {  inM365 } from '../modules/teamsHelpers.js';
import {
    getOrder
} from '../modules/northwindDataService.js';

import { env } from '../modules/env.js';
async function displayUI() {

    const displayElement = document.getElementById('content');
    const detailsElement = document.getElementById('orderDetails');

    try {

        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('orderId')) {
            const orderId = searchParams.get('orderId');

            const order = await getOrder(orderId);

            displayElement.innerHTML = `
                    <h1>Order ${order.orderId}</h1>
                    <p>Customer: ${order.customerName}<br />
                    Contact: ${order.contactName}, ${order.contactTitle}<br />
                    Date: ${new Date(order.orderDate).toDateString()}<br />
                    ${order.employeeTitle}: ${order.employeeName} (${order.employeeId})
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

        }
    }
    catch (error) {            // If here, we had some other error
        message.innerText = `Error: ${JSON.stringify(error)}`;
    }
}
async function displayCallOrChat() {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('orderId')) {
        const orderId = searchParams.get('orderId');
        const buttonElement = document.getElementById("ShowButton");
        if (await inM365()) {
            //chat support
            if (microsoftTeams.chat.isSupported()) {
                buttonElement.textContent = "Chat";
                buttonElement.addEventListener('click', async ev => {
                    await microsoftTeams.chat
                        .openChat({
                            user: [env.CONTACT],                           
                            message: `Hi, to discuss about ${orderId}`
                        });
                });

                //mail support
            } else if (microsoftTeams.mail.isSupported()) {
                buttonElement.textContent = "Mail";
                buttonElement.addEventListener('click', async ev => {
                    microsoftTeams.mail.composeMail({
                        type: microsoftTeams.mail.ComposeMailType.New,
                        subject: `Enquire about order ${orderId}`,
                        toRecipients: [env.CONTACT],
                        message: "Hello",
                    });
                });
            }else{
                buttonElement.style.display="none";
            }
        }
    }
}

displayUI();
displayCallOrChat();