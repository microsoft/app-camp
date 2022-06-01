import {
    getCategory
} from '../modules/northwindDataService.js';

async function displayUI() {

    const displayElement = document.getElementById('content');
    const productsElement = document.getElementById('products');
    const messageDiv = document.getElementById('message');

    try {

        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('categoryId')) {
            const categoryId = searchParams.get('categoryId');

            const category = await getCategory(categoryId);

            if (category) {

                displayElement.innerHTML = `
                <img src="data:image/bmp;base64,${category.picture}" class="categoryImage"></img>
                <h3>${category.displayName}</h3>
                <p>${category.description}</p>
            `;

                category.products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<tr>
                <td><a href="/pages/productDetail.html?productId=${product.productId}">${product.productName}</a></td>
                <td>${product.quantityPerUnit}</td>
                <td>${product.unitPrice}</td>
                <td>${product.unitsInStock}</td>
                <td>${product.unitsOnOrder}</td>
                <td>${product.supplierName} (${product.supplierCountry})</td>
            </tr>`;
                    productsElement.append(row);

                });
            }
        }
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error)}`;
    }
}

displayUI();