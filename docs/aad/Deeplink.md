![Teams App Camp](../../assets/code-lab-banner.png)

# Add a Deep link to a personal Tab

---8<--- "extended-lab-intro.md"

Deep links help the user to directly navigate to the content.
In this lab we will create deep link to entities in Teams so the user can navigate to contents within the app's tab.

In this lab you will learn new concepts as below:

- Generating deep links that open your application in Teams
- Pass business context in deep links to your application using a the Teams SDK `context` object

???+ info "Video briefing"
    <div class="video">
      <img src="/app-camp/assets/video-coming-soon.png"></img>
      <div>Deep links to MIcrosoft Teams applications</div>
    </div>

### Features

- In the application's order details page, add a button to copy the order's tab link into clipboard, that helps users share the link via chat or outlook to colleague, for them to navigate easily to that specific order.

### How to build the deep link

You'll use this syntax to create the deep link for this lab:

```
https://teams.microsoft.com/l/entity/<app-id>/<entitiyId>?context={"subEntityId": "<subEntityId>"}
```

where:

- **app-id** - This teams app id from the manifest file
- **entityId** - This is defined in your manifest file in the `staticTabs` object for the particular entity (tab). In our case this is the entity id `Orders` of  `My Orders` tab.
- **subEntityId** - This is the ID for the item you are displaying information for. This is similar to query parameters. In our case in this lab, it will be the orderId. 

!!! note
    The subEntityId is the query parameter name. When you pass this value, the context will store this information in page.subPageId in Teams JS v2 of the SDK. Previously this was stored in the context as subEntityId. There has been a visual change.

Full details are [here in the documentation](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links?WT.mc_id=m365-58890-cxa){target="_blank"}.

### Exercise 1: Code changes
---

#### Step 1: Update the Order Detail page HTML

In this step, you will edit the Order Detail page to include a "Copy Link" button which copies a deep link to this order to the clipboard.

In your working folder, open **client/page/orderDetail.html**.

Let's add the copy to clipboard button and a div to display a message to show if the copy was successful.

Copy this code code and paste it above `orderDetails` div element.

```javascript
<div id="copySection" style="display: none;">
<div> <button id="btnCopyOrderUrl">Copy order url</button></div>
    <div style="flex-grow: 1;padding:5px;" id="copyMessage">Copy to clipboard</div>
</div> 
```

#### Step 2: Update the Order Detail page JavaScript

In this step, you will add code to the Order Detail page that responds to click events on the "Copy link" button. When the button is pressed, the code will generate a deep link back to the currently displayed order.

In your working folder, open **client/page/orderDetail.js**.
 
Import the environment file from the server to get access to the Teams application ID, which is used in creating a deep link.

Paste below code above the displayUI() function definition.

```javascript
import { env } from '/modules/env.js';
```

Now replace the displayUI() function with below definition, which includes code to generate a deep link when the "Copy URL" button is pushed.

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

!!! note "Explanation for these code changes"

    The deep link is created in the `copyUrlElement.addEventListener()` function.

    The deep link will navigate:
    * to Microsoft Teams
    * to the Northwind Orders application
    * to the Orders tab, which brings up the myOrders.js page
    * to a specific order ID

    The App ID is included in the deep link to help Teams display the correct application. The teams app id is taken from `.env` file, which is the id in the manifest file.

    The `entityId` identifies the tab; in this case it is `Orders`, which is the id for  `My Orders` tab. This is set in the manifest.json file; the relevant section is shown below for your reference.

    `encodedContext` is a JSON constant that defines the parameter(subEntityId) to be passed to the tab; in this case it's the order ID.


```
"staticTabs": [
    {
        "entityId": "Orders",
        "name": "My Orders",
        "contentUrl": "https://<HOST_NAME>/pages/myOrders.html",
        "websiteUrl": "https://<HOST_NAME>/pages/myOrders.html",
        "scopes": [
            "personal"
        ]
    },
    {
        "entityId": "Products",
        "name": "Products",
        "contentUrl": "https://<HOST_NAME>/pages/categories.html",
        "websiteUrl": "https://<HOST_NAME>/pages/categories.html",
        "scopes": [
            "personal"
        ]
    }
],
```
*A tab's Entity ID is defined in the app manifest for static tabs*

#### Step 3: Update the My Orders page to redirect deep links directly to the order detail page

In your working folder, open the **client/myOrders.js** file.

Add import statements for the Microsoft Teams SDK and the Teams helper functions.

```javascript
import { ensureTeamsSdkInitialized, inTeams } from '../modules/teamsHelpers.js';
import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
```

Using the `My Orders` tab as the base, we will redirect the deeplink to the `Order details` page to show the order only if the **subEntitiyId** is present in the teams context. In the `displayUI()` function, at the top of the `try` block, add code to check for a **page.subPageId**  which is where the passed subEntitiyId is stored in the context from v2 of the Teams JS SDK.Once it is found, do the redirect to the sub page.

```javascript
// Handle incoming deep links by redirecting to the selected order
if (await inTeams()) {
    await ensureTeamsSdkInitialized();
    const context = await microsoftTeams.app.getContext();
    if (context.page.subPageId) {
        window.location.href = `/pages/orderDetail.html?orderId=${context.page.subPageId}`;
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
            if (context.page.subPageId) {
                window.location.href = `/pages/orderDetail.html?orderId=${context.page.subPageId}`;
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

#### Step 4: Update the server to provide the Teams app ID as an environment variable

In your working folder, open the **server/server.js** file.

This app uses a little trick to provide the client-side code with values from the **.env** file (or environment settings when the app is deployed). When the client requests /modules.env.js, the server will pass selected environment variables to the client. Care has been taken to not pass any secrets to the client, and the code explicitly copies only a few non-sensitive values.

Since the client side needs the Teams app ID, we need to add that to the list of values.

Update the request `app.get('/modules/env.js')` and add TEAMS_APP_ID as below:

```javascript
app.get('/modules/env.js', (req, res) => {
  res.contentType("application/javascript");
  res.send(`
    export const env = {
      HOST_NAME: "${process.env.HOST_NAME}",
      TENANT_ID: "${process.env.TENANT_ID}",
      CLIENT_ID: "${process.env.CLIENT_ID}",
      TEAMS_APP_ID: "${process.env.TEAMS_APP_ID}"
    };
  `);
});
```

### Exercise 2: Test the changes
---

#### Step 1 : Run the application in Teams client

Now that you have applied all code changes, let's test the features.
This lab assumes you already completed the Core lab and registered an Azure AD application, built and uploaded your Teams package, etc. So at this point, all you should need to do is run

~~~shell
npm start
~~~

Once you are in the application, go to `My orders` page and select any order.
Select **Copy order url**.

On selection, the message next to button changes from *Copy to clipboard* to *Link copied!*

Now open the link in a new browser tab. It should open Microsoft Teams showing the Northwind Orders application with the order information displayed. This animated picture shows the solution in action.

![order](../../assets/screenshots/deeplink-working.gif)

### References

- [Deep links](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links?WT.mc_id=m365-58890-cxa)

### Known issues

---8<--- "issuesLink.md"

### Next steps

After completing this lab, you may continue with additional extended labs!

---8<--- "extended-lab-links.md"
