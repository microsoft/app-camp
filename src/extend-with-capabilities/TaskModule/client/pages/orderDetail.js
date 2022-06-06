import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import { ensureTeamsSdkInitialized, inTeams } from '/modules/teamsHelpers.js';
import {
    getOrder
} from '../modules/northwindDataService.js';

async function displayUI() {

    const displayElement = document.getElementById('content');
    const detailsElement = document.getElementById('orderDetails');
    const btnTaskModuleElement = document.getElementById('btnTaskModule');
    const orderElement=document.getElementById('orderContent');
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
        btnTaskModuleElement.addEventListener('click', async ev => {
            if (!await inTeams()) {
                alert ('Sorry this button only works in Microsoft Teams');
            } else {              
                let taskInfo = {
                    title: null,
                    height: null,
                    width: null,
                    url: null,
                    card: null,
                    fallbackUrl: null,
                    completionBotId: null,
                };
                taskInfo.url = `https://${window.location.hostname}/pages/orderNotesForm.html`;
                taskInfo.title = "Task module order notes";
                taskInfo.height = 210;
                taskInfo.width = 400;
                
                await ensureTeamsSdkInitialized();
                microsoftTeams.tasks.startTask(taskInfo, (err, result) => {                 
                        const postDate = new Date().toLocaleString()
                        const newComment = document.createElement('p');  
                        newComment.innerHTML=`<div><b>Posted on:</b>${postDate}</div>
                        <div><b>Notes:</b>${result.notes}</div><br/>
                        -----------------------------` 
                        orderElement.append(newComment);
                });
            }
        });
    }
    catch (error) {            // If here, we had some other error
        message.innerText = `Error: ${JSON.stringify(error)}`;
    }
}


displayUI();