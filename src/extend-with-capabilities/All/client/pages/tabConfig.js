import 'https://statics.teams.cdn.office.net/sdk/v1.11.0/js/MicrosoftTeams.min.js';
import {
    getLoggedInEmployee
} from '../identity/identityClient.js';

import {
    getCategories
} from '../modules/northwindDataService.js';

async function displayUI() {

    const categorySelect = document.getElementById('categorySelect');
    const messageDiv = document.getElementById('message');

    try {
        microsoftTeams.initialize(async () => {

            const employee = await getLoggedInEmployee();
            if (!employee) {
                // Nobody was logged in, redirect to login page
                window.location.href = "/identity/aadLogin.html";
            }
            let selectedCategoryId = 0;
            let selectedCategoryName = '';

            if (employee) {

                // Set up the save handler for when they save the config
                microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {

                    const url = `${window.location.origin}/pages/categoryDetail.html?categoryId=${selectedCategoryId}`;
                    const entityId = `ProductCategory ${selectedCategoryId}`;
                    microsoftTeams.settings.setSettings({
                      "suggestedDisplayName": selectedCategoryName,
                      "entityId": entityId,
                      "contentUrl": url,
                      "websiteUrl": url
                    });
                    saveEvent.notifySuccess();
                   });

                // Populate the dropdown so they can choose a config
                const categories = await getCategories();
                categories.forEach((category) => {
                    const option = document.createElement('option');
                    option.value = category.categoryId;
                    option.innerText = category.displayName;
                    categorySelect.appendChild(option);
                });

                // When a category is selected, it's OK to save
                categorySelect.addEventListener('change', (ev) => {
                    selectedCategoryName = ev.target.options[ev.target.selectedIndex].innerText;
                    selectedCategoryId = ev.target.value;
                    microsoftTeams.settings.setValidityState(true);
                });
            }
        });
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error.message)}`;
    }
}

displayUI();