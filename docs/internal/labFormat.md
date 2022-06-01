Trying to be consistent with Dan's tool and to a degree with Learn modules.

* There will be two labs, A (Azure AD start) and B (Bespoke auth start).
* Labs contain exercises; each exercise will consist of one file, which contains sections and steps.
* Exercises may contain sections, which are unnumbered and just help users to understand what they're looking at. Sections may not be used if we move to Dan's tool. (?)
* Exercises always contain steps, which are numbered and would be used in Dan's tool

Include a title at the top of each markdown file:
## Exercise A01: Start with Azure Active Directory

Section headings look like this, and are not numbered
### Features

Steps look like this and are numbered
#### Step 1 - App Registration

Tips look like this, with a cool smiley empticon:

---
> 😎 DON'T DEVELOP IN PRODUCTION: It may be tempting to build solutions right where you work every day, but there are good reasons to have a dedicated dev tenant - and probably additional staging/test tenants. They're free, and you can safely experiment as a tenant admin without risking your production work. 
---

Notes look like this:

---
> **NOTE:** If you recently created your tenant, the **Teams** l
---

Callouts: Please add numbered callouts to your screen shots if users need to click or enter text in a particular spot. Refer to the callouts in the written instructions using the Unicode characters 1️⃣, 2️⃣, 3️⃣, 4️⃣, etc.

Symbols in code: Please use `monospaced` text for variable names, function names, etc. Reference function names with a pair of parenthesis such as `myFunction()`.

File names: Please [hyperlink](#) to files for easy navigation

Images : Save your images in a folder in the repo. Please use the image tag and refer the github url of the image asset as shown below. This is to make the images available in Dan's training tool. Relative image URLs do not work there.

`<img src="https://github.com/OfficeDev/TeamsAppCamp1/blob/main/Labs/Assets/06-006-productcard.png?raw=true" alt="Product card"/>`

