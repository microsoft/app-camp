import { getFetchHeadersAuth } from "../identity/identityClient.js";

export async function getEmployee(employeeId) {

    if (!employeeId) {
        return null;
    }

    const response = await fetch (`/api/employee?employeeId=${employeeId}`, {
        "method": "get",
        "headers": await getFetchHeadersAuth(),
        "cache": "default"
    });
    if (response.ok) {
        const employee = await response.json();
        return employee;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }
}

export async function getOrder(orderId)
{
    const response = await fetch (`/api/order?orderId=${orderId}`, {
        "method": "get",
        "headers": await getFetchHeadersAuth(),
        "cache": "default"
    });
    if (response.ok) {
        const orders = await response.json();
        return orders;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}

export async function getCategories()
{
    const response = await fetch (`/api/categories`, {
        "method": "get",
        "headers": await getFetchHeadersAuth(),
        "cache": "default"
    });
    if (response.ok) {
        const categories = await response.json();
        return categories;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}

export async function getCategory(categoryId)
{
    const response = await fetch (`/api/category?categoryId=${categoryId}`, {
        "method": "get",
        "headers": await getFetchHeadersAuth(),
        "cache": "default"
    });
    if (response.ok) {
        const categories = await response.json();
        return categories;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}

export async function getProduct(productId)
{
    const response = await fetch (`/api/product?productId=${productId}`, {
        "method": "get",
        "headers": await getFetchHeadersAuth(),
        "cache": "default"
    });
    if (response.ok) {
        const categories = await response.json();
        return categories;
    } else {
        const error = await response.json();
        console.log (`ERROR: ${error}`);
        throw (error);
    }    
}
