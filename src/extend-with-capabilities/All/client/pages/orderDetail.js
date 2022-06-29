import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import { ensureTeamsSdkInitialized, inTeams } from '/modules/teamsHelpers.js';
import {
    getOrder
} from '../modules/northwindDataService.js';
import { env } from '/modules/env.js';

async function displayUI() {

    const displayElement = document.getElementById('content');
    const detailsElement = document.getElementById('orderDetails');
    const btnTaskModuleElement = document.getElementById('btnTaskModule');
    const orderElement = document.getElementById('orderContent');
    const copyUrlElement = document.getElementById('btnCopyOrderUrl');
    const copyMsgElement = document.getElementById('copyMessage');
    const copySectionElement = document.getElementById('copySection');
    const errorMsgElement = document.getElementById('message');
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

            copySectionElement.style.display = "flex";
            copyUrlElement.addEventListener('click', async ev => {
                try {
                    //temp textarea for copy to clipboard functionality
                    var textarea = document.createElement("textarea");
                    const encodedContext = encodeURI(`{"subEntityId": "${order.orderId}"}`);
                    //form the deeplink                       
                    const deeplink = `https://teams.microsoft.com/l/entity/${env.TEAMS_APP_ID}/Orders?&context=${encodedContext}`;
                    textarea.value = deeplink;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy"); //deprecated but there is an issue with navigator.clipboard api
                    document.body.removeChild(textarea);
                    copyMsgElement.innerHTML = "Link copied!"

                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            });
        } else {
            errorMsgElement.innerText = `No order to show`;
            displayElement.style.display = "none";
            orderDetails.style.display = "none";
        }

        btnTaskModuleElement.addEventListener('click', async ev => {
            await ensureTeamsSdkInitialized();
            if (!microsoftTeams.dialog.isSupported()) {
                alert ('Sorry this button is not supported');
            } else {              
                let taskInfo = {
                    title: null,
                    height: null,
                    width: null,
                    url: null,               
                    fallbackUrl: null                   
                };
                taskInfo.url = `https://${window.location.hostname}/pages/orderNotesForm.html`;
                taskInfo.title = "Order notes";
                taskInfo.size= {height:210,width: 400};   
                let submitHandler = (response) => { 
                    if(response.result){
                        const result=response.result;
                        const postDate = new Date().toLocaleString()
                        const newComment = document.createElement('p');
                            if (result.notes) {
                                newComment.innerHTML = `<div><b>Posted on:</b>${postDate}</div>
                            <div><b>Notes:</b>${result.notes}</div><br/>
                            -----------------------------` 
                            orderElement.append(newComment);
                        } 
                    }else{
                        console.log(`Error in response from dialog.submit${response.err}`)
                    }               
                                    
                    };
                microsoftTeams.dialog.open(taskInfo,submitHandler)
            }
        });    

    }
    catch (error) {            // If here, we had some other error
        errorMsgElement.innerText = `Error: ${JSON.stringify(error)}`;
    }
}


displayUI();