# App Camp Quiz Questions

Quizzes don't have to be a dreaded activity with closed books and grading. App Camp should be fun! However a simple quiz or two, in which questions and answers are discussed openly with a whole classroom, can be a great way to ensure students understand. It also can serve as a review, as you or the students who do understand review the correct answers and common misconceptions. Quizzes can even be gamified with use of a tool like [Kahoot!](https://kahoot.com){target="_blank"}.

These questions have been play tested in live App Camp workshops; they're designed to provoke discussion of key concepts and to dispel common misconceptions. The correct answers are marked with a "*"; in some cases there is more than one correct answer.

## Teams App Concepts

1. **Microsoft Graph is a charting tool for use in Microsoft 365**

    a. True

    b. False *

    DISCUSS: _Microsoft Graph is the main API for accessing all the content in a Microsoft 365 tenant._

2. **Where do Microsoft Teams applications run?**

    a. Teams Application Host

    b. Teams Shared Service Provider

    c. Anywhere on the Internet *

    d. Skype Spaces

    DISCUSS: _Teams apps can run anywhere on the Internet. Microsoft Teams accesses the application using information in the Teams app manifest, and stitches the app into the Teams user interface._

3. **You can show _____ on an adaptive card:**

    a. Images *

    b. Input fields *

    c. Custom styles

    d. Action buttons *

    DISCUSS: _Adaptive cards are designed to blend in with the hosting application, so custom styles are not available. These cards run in Teams, Outlook, and several other products, and each hosting product has its own styling._

4. **A Teams app manifest is a _____ file**

    a. JavaScript

    b. JSON *

    c. JSX

    d. YAML

    DISCUSS: _It's a JSON file that is placed in a .zip archive with two icons to create a Teams application package that would be uploaded to Teams or placed in the Teams app store_

5. **ngrok is a _____**

    a. Space mission to Mars

    b. Tunneling program *

    c. Relational database

    d. Machine learning

    DISCUSS: _ngrok provides a tunnel so requests from the Azure Bot Channel Service can be delivered to your locally running application during development. It also handles host naming and HTTPS termination. The name may well be a reference to Robert Heinlein's science fiction classic "Stranger in a Strange Land", in which it is a Martian word meaning to understand something intuitively or empathetically._

6. **What do you get when you join the Microsoft 365 Developer program?**

    a. A free Microsoft 365 developer tenant with 10 users (E3 licensing)

    b. A discount on a Microsoft 365 developer tenant with 1 user (E3 licensing)

    c. A discount on a Microsoft 365 developer tenant with 10 users (E5 licensing)

    d. A free Microsoft 365 developer tenant with 25 users (E5 licensing) *

    DISCUSS: _This is a great deal! The developer tenant is free and includes 25 of the higher-end E5 licenses so you can test your application. These tenants are for development use only, and are given for 90 days, which will automatically renew if the system gets signals that you are still doing development._

7. **When your bot recieves an activity from Microsoft Teams, _____ creates a turn**

    a. Bot adapter *

    b. Bot builder

    c. Channel

    d. Bob the builder

    DISCUSS: _The Bot Builder SDK's adapter object is responsible for handling turns. A turn is an exchange of one or more "activities" which a bot's web server processes in one run._

## Azure AD Concepts

1. **In the context of Teams applications, SSO stands for _____**

    a. Single Sign-On *

    b. Simple Sign-On

    c. Sales Service Order

    d. Singapore Symphony Orchestra

    DISCUSS: _Single Sign-On means different things in different products, and is often used in marketing claims, so the exact meaning tends to vary depending on the product(s) involved._

2. **In the context of Teams applications, Single Sign-on means:**

    a. Users can use the same username and password for your application as they do for Microsoft 365

    b. Users don't have to retype their username or password when using your application in Teams

    c. Users are never prompted to log into your application even if they switch to using it on a new device

    d. All of these are part of Teams SSO *

    DISCUSS: _Microsoft Teams has a fairly rigorous definition of SSO. Microsoft Azure uses the term to cover a wider set of scenarios._

3. **What kind of Azure AD permission lets you act on behalf of the logged-in user?**

    a. application

    b. conditional

    c. delegated *

    d. user

    DISCUSS: _Delegated permission allows an application to act on behalf of a user when calling an API such as the Microsoft Graph. Application permission allows an application to act on its own behalf, and always requires an administrator to consent._

4. **Microsoft Teams SSO makes it easy for an application to request an access token. What can you access using this token?**

    a. Microsoft Teams JavaScript SDK

    b. The Microsoft Graph API

    c. The application's own back-end service *

    d. Nothing; this call returns an Identity token not an access token

    DISCUSS: _It's a common misconception that these are ID tokens! If you inspect one in https://jwt.ms, you can see the audience claim is set to the application ID of your application, meaning it is an access token targeting your own back-end service._

5. **Who can consent to granting permissions to an application within a Microsoft 365 tenant?**

    a. Any user

    b. Any user, but only for certain delegated permissions that are less sensitive *

    c. A tenant administrator *

    d. Microsoft, by making a request to the M365 Core Services team

    DISCUSS: _For some simple delegated permissions, a user can consent. For anything sensitive (as documented in the Microsoft Graph API for example), as well as for any application permissions, an administrator must consent. If an app wants to avoid prompting users, it may want to prompt the administrator for all the permission needed, for example in the app's landing page that's shown when the app is purchased in the Teams app store._

6. **If your Teams SSO application wants to call the Microsoft Graph API, how should it obtain an access token to do this?**

    a. Simply request it from Teams SSO

    b. Use the Microsoft Authentication Library (MSAL)

    c. On your application's server, exchange the app's own access token for a Graph access token using the On Behalf Of flow *

    d. Pass the username and password instead of a token

    DISCUSS: _The OBO flow is used to exchange the app's token for a Graph access token. This must be done on a "confidential client" such as a web server, where the app secret can be safely used. It's a best practice not to send this token back to the client, where a user could obtain it and use it for other purposes until the token expires. So the app should make any Graph calls from the server and pass results, rather than the token, back to the client side._

## Commercial Marketplace and App Monetization questions

1. **When you sell in the Microsoft Teams app store, your app's licenses will appear in the Microsoft 365 Admin portal alongside Microsoft product licenses.**

    a. True

    b. False *

    DISCUSS: _This is a common area of confusion; partners or customers look in the same place for Teams app licenses as they already do for Microsoft 365 licenses. However the app licenses are different and are managed by the application itself, so generally there is some kind of settings or administrator page within each app to manage its licenses._

2. **How can you reach out to buyers through Microsoft Commercial Marketplace?**

    a. Direct (Buyers coming to Teams Store / App Source / Teams Admin Portal)

    b. Microsoft's partner channel (90K partners around the world)

    c. Microsoft's field sellers

    d. All of the above *

    DISCUSS: _All these methods are available once your transactable SaaS offer is published in Partner Center and linked to an application in the Teams App Store._

3. **Partners set up the information needed to purchase their app (a "Transactable SaaS Offer") in what tool?**

    a. Azure Portal

    b. Commerce Server Catalog Manager

    c. Partner Center *

    d. Teams Developer Portal

    DISCUSS: _Partner Center is where partners set up the details Microsoft needs to sell subscriptions to their applications._

4. **Do you have a Partner Center account?**

    a. Yes, all set!

    b. Nope

    c. Not sure but I know who to ask

    d. Not sure and I'm not sure who in my org to ask

    DISCUSSION: _This is more of a survey than a quiz question. It's worth getting an early start in setting this up as there are legal aspects that may require approvals within an ISV's organization._

5. **Customers will be able to purchase your Teams application in:**

    a. App source *

    b. Aure Marketplace

    c. Microsoft Store

    d. Microsoft Teams App Store *

    DISCUSSION: _Monetized Teams apps appear in App Source and the Teams App Store. The Windows store, and Azure Marketplace are all different ways of selling apps through Microsoft._

6. **Microsoft Teams can be coupled with which type of Commercial Marketplace solution?**

    a. SaaS *

    b. Azure Managed Application

    c. Virtual Machine

    d. All of the above

    DISCUSSION: _Teams apps are considered SaaS offerings. Azure Managed Apps and Virtual Machines are specific to Microsoft Azure._

7. **How much does Microsoft keep when you sell your Teams application in the Teams app store or App Source?**

    a. 3% *

    b. 7%

    c. 20%

    d. 22%

    DISCUSSION: _3% is similar to a credit card transaction fee, and significantly less than other app stores!_

