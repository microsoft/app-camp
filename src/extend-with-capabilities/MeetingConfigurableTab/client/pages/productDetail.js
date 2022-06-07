import {
    getProduct
} from '../modules/northwindDataService.js';

async function displayUI() {

    const displayElement = document.getElementById('content');
    const ordersElement = document.getElementById('orders');
    const messageDiv = document.getElementById('message');

    try {

        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('productId')) {
            const productId = searchParams.get('productId');

            const product = await getProduct(productId);

            if (product) {

                displayElement.innerHTML = `
                <h3>${product.productName}</h3>
                <table>
                <tr><td>Category</td><td><a href="/pages/categoryDetail.html?categoryId=${product.categoryId}">${product.categoryName}</a></td></tr>
                <tr><td>Product ID</td><td>${product.productId}</td></tr>
                  <tr><td>Quantity per Unit</td><td>${product.quantityPerUnit}</td></tr>
                  <tr><td>Unit Price</td><td>${product.unitPrice}</td></tr>
                  <tr><td>Units in Stock</td><td>${product.unitsInStock}</td></tr>
                  <tr><td>Reorder Level</td><td>${product.reorderLevel}</td></tr>
                  <tr><td>Supplier Name</td><td>${product.supplierName}</td></tr>
                  <tr><td>Supplier Country</td><td>${product.supplierCountry}</td></tr>
                  <tr><td>Discontinued</td><td>${product.discontinued ? "yes" : "no"}</td></tr>
                </table>
            `;

                product.orders.forEach(order => {
                    const orderRow = document.createElement('tr');
                    orderRow.innerHTML = `<tr>
                        <td><a href="/pages/orderDetail.html?orderId=${order.orderId}">${order.orderId}</a></td>
                        <td>${order.orderDate}</td>
                        <td>${order.quantity}</td>
                        <td>${order.customerName}</td>
                        <td>${order.customerAddress}</td>
                    </tr>`;
                    ordersElement.append(orderRow);

                });
            }
        }
    }
    catch (error) {            // If here, we had some other error
        messageDiv.innerText = `Error: ${JSON.stringify(error)}`;
    }
}

displayUI();