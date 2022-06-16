![Teams App Camp](../../assets/code-lab-banner.png)

## Add a Dialog

---8<--- "extended-lab-intro.md"

**Dialogs** as they are call it in [version 2 of the SDK](https://docs.microsoft.com/en-us/javascript/api/@microsoft/teams-js/dialog){target="_blank"} are modal pop-up experiences in Teams application that can display web pages as IFrames or adaptive cards. This can greatly simplify the user experience when a data input is required, and gives your application an opportunity to interact one-on-one with a user even in a group environment.

There are many ways you can incorporate a dialog. In this lab we focus on using the app's own HTML form.

In this lab you will learn to:

- How to build a [Dialog](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/what-are-task-modules?WT.mc_id=m365-58890-cxa){target="_blank"} using a web page
- How to launch a dialog from a tab using the Teams JavaScript SDK
- How to submit data from the dialog back to the tab that launched it

The completed lab is [here](https://github.com/microsoft/app-camp/tree/main/src/extend-with-capabilities/Dialog){target="_blank"}

???+ info "Video briefing"
    <div class="video">
      <img src="/app-camp/assets/video-coming-soon.png"></img>
      <div>Configurable Tabs for Microsoft Teams</div>
    </div>

### Features

- In the application's order details page, there will be a button that allows adding notes to the order
- Pressing the button opens a dialog to capture the notes
- The notes are passed back to the order details page and displayed there

### Exercise 1: Code changes

#### Step 1: Add the HTML page and JavaScript file that will be displayed in the dialog

In your working folder, under the `/client/pages` path, create a new file `orderNotesForm.html` and copy this code to it:

```HTML
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Dialog: Update order notes</title>
    <link rel="stylesheet" href="/northwind.css" />
    <link rel="icon" href="data:;base64,="> <!-- Suppress favicon error -->
</head>
    <body>
                 
        <form id="orderForm">
            <div>                
               <textarea id="notes" name="notes" rows="4" cols="50"></textarea>               
            </div>
            <div>
                <button type="submit" tabindex="2">Save</button>
            </div>
        </form>
        <script type="module" src="orderNotesForm.js"></script>
    </body>

</html>

```
In the same folder, under the `/client/pages` path, create a new file `orderNotesForm.js` and copy this code to it:

```javascript
import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import { ensureTeamsSdkInitialized } from '../modules/teamsHelpers.js';
import {env} from '../modules/env.js'
async function displayUI() {
    await ensureTeamsSdkInitialized();
    document.getElementById('orderForm').addEventListener("submit", async (e) => {
        let orderFormInfo = {
            notes: document.forms["orderForm"]["notes"].value,
        };     
        await microsoftTeams.dialog.submit(orderFormInfo,env.TEAMS_APP_ID);
        return true;
    });
}
displayUI();

```

This is a web form which captures an input `notes` which is a multi line text area. The form uses Microsoft Teams SDK's [`microsoftTeams.dialog.submit` function](https://docs.microsoft.com/en-us/javascript/api/@microsoft/teams-js/dialog?view=msteams-client-js-latest#@microsoft-teams-js-dialog-submit){target="_blank"} to pass the form values back into a callback function.


#### Step 2: Update the Order Detail HTML

In this step, we'll add an "Add Notes" button to the Order Detail page and an HTML element to display the notes.

In your working folder, open **/client/pages/orderDetail.html**

Copy below block of code and paste it above the `<table>` element of the page.

```html
<div id="orderContent">    
</div>
<br/>
<button id="btnTaskModule">Add notes</button>
```

#### Step 3: Update the Order Detail JavaScript

In your working folder, open **/client/pages/orderDetail.js**.

At the top of the file, import the Teams SDK and Teams helper module.

```javascript
import 'https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js';
import { ensureTeamsSdkInitialized } from '/modules/teamsHelpers.js';
```

Now in the displayUI() function, define two constants to get the two HTML elements we just added.

```javascript
 const btnTaskModuleElement = document.getElementById('btnTaskModule');
 const orderElement=document.getElementById('orderContent');
```

To open the dialog, add an event listener for the button `btnTaskModule`. Paste below code in the `dislayUI()` function in the end, before closing the `try` block.

```javascript
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
```

To open a dialog from a tab, use `microsoftTeams.dialog.open()`.
You can also check if a capability is supported in the app running in Microsoft 365 apps (in case you plan to extend your application across Microsoft365 host apps like outlook/office.com). Here dialog is a capability so we are checking if it is supported using `microsoftTeams.dialog.isSupported()` function.

You can pass the [taskInfo](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/task-modules/invoking-task-modules?WT.mc_id=m365-58890-cxa#the-taskinfo-object){target="_blank"} object and a callback function called `submitHandler` to pass the results back from the dialog.

The final look of displayUI() function is as below:

```javascript
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
        message.innerText = `Error: ${JSON.stringify(error)}`;
    }
}
```
#### Step 4: Update the serve.js file 

In your working folder, open **/server/server.js** and update the `app.get('/modules/env.js')` call to send an additional property **TEAMS_APP_ID**, which is the teams application's `id` (as in the manifest file) to be used in client side pages.

<pre>
app.get('/modules/env.js', (req, res) => {
  res.contentType("application/javascript");
  res.send(`
    export const env = {
      HOST_NAME: "${process.env.HOST_NAME}",
      TENANT_ID: "${process.env.TENANT_ID}",
      CLIENT_ID: "${process.env.CLIENT_ID}",
      <b>TEAMS_APP_ID:"${process.env.TEAMS_APP_ID}"</b>
    };
  `);
});
</pre>


???+ warning " TEAMS_APP_ID is used in the `dialog.submit()`as a parameter along with the results that needs to be sent back to the `submitHandler()` callback function. Although this is an optional parameter, there is a [known issue](https://github.com/OfficeDev/microsoft-teams-library-js/issues/1211#issuecomment-1156988862) in the TeamsJS SDK v2 which needs the parameter to be passed." 


### Exercise 2: Test the changes
---
#### Step 1 : Run the application in Teams client

Now that you have applied all code changes, let's test the features.
This lab assumes you already completed the Core lab and registered an Azure AD application, built and uploaded your Teams package, etc. So at this point, all you should need to do is run

- Once you are in the application, go to `My orders` page and select any order.
- Once in the order details page, select the **Add notes** button to open the dialog.
- Add comment/note and select **Save**.
- Notice the dialog closed and the results getting added into the order details page.

![dialog working](../../assets/taskmodule-working.gif)

!!! note 
    The comments are not saved back into the northwind database at this time, so they'll only persist as long as you stay on the order details page.

### Known issues

---8<--- "issuesLink.md"

### Next steps

After completing this lab, you may continue with additional extended labs!

---8<--- "extended-lab-links.md"