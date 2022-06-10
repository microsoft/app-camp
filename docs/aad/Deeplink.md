![Teams App Camp](../../assets/code-lab-banner.png)

## Add a Deep link to a personal Tab

This lab is part of extending app capabilities for your teams app which begins with a Northwind Orders core application using the `AAD` path. The [core app](../../src/create-core-app/aad/A03-after-apply-styling/) is the boilerplate application with which you will do this lab.

> Complete labs [A01](A01-begin-app.md)-[A03](A03-after-apply-styling.md) for deeper understanding of how the core application works, to set up AAD application registration etc. to update the `.env` file as per the `.env_sample`. This configuration is required for the success of the lab.

The completed lab is [here](../../src/extend-with-capabilities/Deeplink/)

Deep links help the user to directly navigate to the content.
In this lab we will create deep link to entities in Teams so the user can navigate to contents within the app's tab.

In this exercise you will learn new concepts as below:

- [Deep links](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links?WT.mc_id=m365-58890-cxa)


### How to build the deep link

Use below syntax, to create the deep link for this lab.

```
https://teams.microsoft.com/l/entity/<app-id>/<entitiyId>?context={"subEntityId": "<subEntityId>"}
```

- **app-id** - This teams app id from the manifest file
- **entityId** - This is defined in your manifest file in the `staticTabs` object for the particular entity (tab). In our case this is the entity id `Orders` of  `My Orders` tab.
- **subEntityId** - This is the ID for the item you are displaying information for. This is similar to query parameters. In our case in this lab, it will be the orderId.


### Features

- In the application's order details page, add a button to copy the order's tab link into clipboard, that helps users share the link via chat or outlook to colleague, for them to navigate easily to that specific order.


### Exercise 1: Code changes
---

#### Step 1: Update existing files


**1. client\page\orderDetail.html**

Let's add the copy to clipboard button and a div to display a message to show if the copy was successful.

Add below block of code and paste it above `orderDetails` div element.

```javascript
<div id="copySection" style="display: none;">
<div> <button id="btnCopyOrderUrl">Copy order url</button></div>
    <div style="flex-grow: 1;padding:5px;" id="copyMessage">Copy to clipboard</div>
</div> 
```

**2. client\page\orderDetail.js**
 
Import the teams SDK module as well as the environment variable we exported to use.

Paste below code above the displayUI() function definition.

```javascript
import { env } from '/modules/env.js';

```

Replace the displayUI() function with below definition:

```javascript
async function displayUI() {

    const displayElement = document.getElementById('content');
    const detailsElement = document.getElementById('orderDetails');
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

    }
    catch (error) {            // If here, we had some other error
        errorMsgElement.innerText = `Error: ${JSON.stringify(error)}`;
    }
}
```
##### Explanation for above code changes

The deep link is created in the `copyUrlElement.addEventListener()` function.

The deep link will navigate:
 * to Microsoft Teams
 * to the Northwind Orders application
 * to the Orders tab, which brings up the myOrders.js page
 * to a specific order ID

The App ID is included in the deep link to help Teams display the correct application. The teams app id is taken from `.env` file, which is the id in the manifest file.

`encodedContext` is a JSON constant that defines the parameter(subEntityId) to be passed to the tab; in this case it's the order ID.

The **entityId** identifies the tab; in this case it is `Orders`, which is the id for  `My Orders` tab. This is set in the manifest.json file; the relevant section is here for your reference:

```json
....
 "staticTabs": [
    {
      "entityId": "Orders",
      "name": "My Orders",
      "contentUrl": "https://<HOSTNAME>/pages/myOrders.html",
      "websiteUrl": "https://<HOSTNAME>/pages/myOrders.html",
      "scopes": [
        "personal"
      ]
    },
    {
      "entityId": "Products",
      "name": "Products",
      "contentUrl": "https://<HOSTNAME>/pages/categories.html",
      "websiteUrl": "https://<HOSTNAME>/pages/categories.html",
      "scopes": [
        "personal"
      ]
    }
  ],
....
```


**4. client\myOrders.js**

Add import statements for the Microsoft Teams SDK and the inTeams helper function.

```javascript
import { ensureTeamsSdkInitialized, inTeams } from '../modules/teamsHelpers.js';
import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
```

Using the `My Orders` tab as the base, we will redirect the deeplink to `Order details` page to show the order only if the **subEntitiyId** is present in the teams context. In the `displayUI()` function, at the top of the `try` block, add code to check for a **subEntityId** and do the redirect if it's found.

```javascript
// Handle incoming deep links by redirecting to the selected order
if (await inTeams()) {
    await ensureTeamsSdkInitialized();
    const context = await microsoftTeams.app.getContext();
    if (context.subEntityId) {
        window.location.href = `/pages/orderDetail.html?orderId=${context.subEntityId}`;
    }
}

```

The updated function definition looks like below:

```javascript
async function displayUI() {

    const displayElement = document.getElementById('content');
    const ordersElement = document.getElementById('orders');
    const messageDiv = document.getElementById('message');

    try {

        // Handle incoming deep links by redirecting to the selected order
        if (await inTeams()) {
            await ensureTeamsSdkInitialized();
            const context = await microsoftTeams.app.getContext();
            if (context.subEntityId) {
                window.location.href = `/pages/orderDetail.html?orderId=${context.subEntityId}`;
            }
        }

        // Display order data
        const employee = await getLoggedInEmployee();
        if (employee) {
            
            displayElement.innerHTML = `
                <h3>Orders for ${employee.displayName}<h3>
            `;

            employee.orders.forEach(order => {
                const orderRow = document.createElement('tr');
                orderRow.innerHTML = `<tr>
                <td><a href="/pages/orderDetail.html?orderId=${order.orderId}">${order.orderId}</a></td>
                <td>${(new Date(order.orderDate)).toDateString()}</td>
                <td>${order.shipName}</td>
                <td>${order.shipAddress}, ${order.shipCity} ${order.shipRegion || ''} ${order.shipPostalCode || ''} ${order.shipCountry}</td>
            </tr>`;
                ordersElement.append(orderRow);

            });
        }
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error)}`;
    }
}
```

**5. server\server.js**

We need the teams app id from the manifest (which is added based on the value in the .env file).
We'll need to expose this id in the client side code.

Update the request `app.get('/modules/env.js')` and add TEAMS_APP_ID as below:
<pre>
app.get('/modules/env.js', (req, res) => {
  res.contentType("application/javascript");
  res.send(`
    export const env = {
      HOST_NAME: "${process.env.HOST_NAME}",
      TENANT_ID: "${process.env.TENANT_ID}",
      CLIENT_ID: "${process.env.CLIENT_ID}"<b>,
      TEAMS_APP_ID: "${process.env.TEAMS_APP_ID}"</b>
    };
  `);
});
</pre>

**6. manifest\manifest.template.json**

Update the version number so it's greater than it was; for example if your manifest was version 1.4, make it 1.4.1 or 1.5.0. This is required in order for you to update the app in Teams.

~~~json
"version": "1.5.0"
~~~

### Exercise 2: Test the changes
---

#### Step 4 : Run the application in Teams client

Now that you have applied all code changes, let's test the features.
This lab assumes you already completed the Core lab and registered an Azure AD application, built and uploaded your Teams package, etc. So at this point, all you should need to do is run

~~~shell
npm start
~~~

Once you are in the application, go to `My orders` page and select any order.
Select **Copy order url**.

On selection, the message next to button changes from *Copy to clipboard* to *Link copied!*

Login as another user who has Northwind Order app installed in their teams.
Open the link in the browser. It should open in the personal tab with the order information displayed. This animated picture shows the solution in action.

![order](../../assets/screenshots/deeplink-working.gif)

### Next steps

After completing this lab, you may continue with any of the following labs.

- [Add a Configurable Tab](./ConfigurableTab.md)
- [Add a Messaging Extension](./MessagingExtension.md)
- [Add a Task Module](TaskModules.md)
- [Selling Your SaaS-based Teams Extension](./Monetization.md)
