import {
    getCategories
} from '../modules/northwindDataService.js';

async function displayUI() {

    const categoriesTable = document.getElementById('categories');
    const messageDiv = document.getElementById('message');

    try {
        const categories = await getCategories();
        if (categories) {
            
            categories.forEach(category => {
                const categoryRow = document.createElement('tr');
                categoryRow.innerHTML = `<tr>
                <td><img src="data:image/bmp;base64,${category.picture}" class="categoryImage"></image></td>
                <td><a href="/pages/categoryDetail.html?categoryId=${category.categoryId}">${category.displayName}</a></td>
                <td>${category.description}</td>
            </tr>`;
                categoriesTable.append(categoryRow);

            });
        }
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error)}`;
    }
}

displayUI();