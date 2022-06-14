import 'https://statics.teams.cdn.office.net/sdk/v1.11.0/js/MicrosoftTeams.min.js';
function displayUI() {
    microsoftTeams.initialize();
    document.getElementById('orderForm').addEventListener("submit", (e) => {
        let orderFormInfo = {
            notes: document.forms["orderForm"]["notes"].value,
        }
        microsoftTeams.tasks.submitTask(orderFormInfo);
        return true;
    });
}
displayUI();
