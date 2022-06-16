![Teams App Camp](../../assets/code-lab-banner.png)

## Add a Task Module 

---8<--- "extended-lab-intro.md"

**Task modules** or **Dialogs** as they are called in [version 2 of the SDK](https://docs.microsoft.com/en-us/javascript/api/@microsoft/teams-js/dialog){target="_blank"} are modal pop-up experiences in Teams application that can display web pages as IFrames or adaptive cards. This can greatly simplify the user experience when a data input is required, and gives your application an opportunity to interact one-on-one with a user even in a group environment.

There are many ways you can incorporate a task module. In this lab we focus on using the app's own HTML form.

In this lab you will learn to:

- How to build a [Task module](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/what-are-task-modules?WT.mc_id=m365-58890-cxa){target="_blank"} using a web page
- How to launch a task module from a tab using the Teams JavaScript SDK
- How to submit data from the task module back to the tab that launched it

The completed lab is [here](https://github.com/microsoft/app-camp/tree/main/src/extend-with-capabilities/TaskModule){target="_blank"}

???+ info "Video briefing"
    <div class="video">
      <img src="/app-camp/assets/video-coming-soon.png"></img>
      <div>Configurable Tabs for Microsoft Teams</div>
    </div>

### Features

- In the application's order details page, there will be a button that allows adding notes to the order
- Pressing the button opens a task module to capture the notes
- The notes are passed back to the order details page and displayed there

### Exercise 1: Code changes

#### Step 1: Add the HTML page that will be displayed in the task module

In your working folder, under the `/client/pages` path, create a new file `orderNotesForm.html` and copy this code to it:

```HTML
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>Task Module: Update order notes</title>
    <link rel="stylesheet" href="/northwind.css" />
    <link rel="icon" href="data:;base64,="> <!-- Suppress favicon error -->
    <script src="https://statics.teams.cdn.office.net/sdk/v1.11.0/js/MicrosoftTeams.min.js"
        asp-append-version="true"></script>
</head>
    <body>
        <script>
            microsoftTeams.initialize();
            function validateForm() {
                var orderFormInfo = {
                    notes: document.forms["orderForm"]["notes"].value,
                }                        
                microsoftTeams.tasks.submitTask(orderFormInfo);
                return true;
            }
        </script>            
        <form id="orderForm" onSubmit="validateForm()">
            <div>                
               <textarea id="notes" name="notes" rows="4" cols="50"></textarea>               
            </div>
            <div>
                <button type="submit" tabindex="2">Save</button>
            </div>
        </form>
    </body>

</html>

```

This is a web form which captures an input `notes` which is a multi line text area. The form uses Microsoft Teams SDK's [`microsoftTeams.tasks.submitTask()` function](https://docs.microsoft.com/en-us/javascript/api/@microsoft/teams-js/dialog?view=msteams-client-js-latest#@microsoft-teams-js-dialog-submit){target="_blank"} to pass the form values back into a callback function.


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
import { ensureTeamsSdkInitialized, inTeams } from '/modules/teamsHelpers.js';
```

Now in the displayUI() function, define two constants to get the two HTML elements we just added.

```javascript
 const btnTaskModuleElement = document.getElementById('btnTaskModule');
 const orderElement=document.getElementById('orderContent');
```

To open the task module, add an event listener for the button `btnTaskModule`. Paste below code in the `dislayUI()` function in the end, before closing the `try` block.

```javascript
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
```

To open a dialog from a tab, use `microsoftTeams.tasks.startTask()`.
You can pass the [taskInfo](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/task-modules/invoking-task-modules#the-taskinfo-object){target="_blank"} object and a callback function called `submitHandler` to pass the results back from the dialog.

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
```

### Exercise 2: Test the changes
---
#### Step 1 : Run the application in Teams client

Now that you have applied all code changes, let's test the features.
This lab assumes you already completed the Core lab and registered an Azure AD application, built and uploaded your Teams package, etc. So at this point, all you should need to do is run

- Once you are in the application, go to `My orders` page and select any order.
- Once in the order details page, select the **Add notes** button to open the dialog.
- Add comment/note and select **Save**.
- Notice the dialog closed and the results getting added into the order details page.

![task module working](../../assets/taskmodule-working.gif)

!!! note 
    The comments are not saved back into the northwind database at this time, so they'll only persist as long as you stay on the order details page.

### Known issues

---8<--- "issuesLink.md"

### Next steps

After completing this lab, you may continue with additional extended labs!

---8<--- "extended-lab-links.md"