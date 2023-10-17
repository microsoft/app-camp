const PRODUCT_TABLE = 'Products';
const CATEGORY_TABLE = 'Categories';
const SUPPLIER_TABLE = 'Suppliers';
import { TableClient } from "@azure/data-tables";
import config from "./config";

// #region Table schemas for reference only

// export interface Product extends Row {
//     ProductID: number;
//     ProductName: string;
//     SupplierID: number;
//     CategoryID: number;
//     QuantityPerUnit: string;
//     UnitPrice: number;
//     UnitsInStock: number;
//     UnitsOnOrder: number;
//     ReorderLevel: number;
//     Discontinued: boolean;
//     ImageUrl: string;
// }
// export interface Category extends Row {
//     CategoryID: number;
//     CategoryName: string;
//     Description: string;
//     Picture: string;
// }
// export interface Supplier extends Row {
//     SupplierID: number;
//     CompanyName: string;
//     ContactName: string;
//     ContactTitle: string;
//     Address: string;
//     City: string;
//     Region: string;
//     PostalCode: string;
//     Country: string;
//     Phone: string;
//     Fax: string;
//     HomePage: string;
// }

// #endregion

async function getProductsByName(startsWith) {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.CUSTOMER);

    const entities = tableClient.listEntities();

    let result = [];
    for await (const entity of entities) {
        if (startsWith && entity.CompanyName.toLowerCase().startsWith(startsWith.toLowerCase())) {
            result.push(entity);
        }
    }
    return result;
}

async function updateProductInventory(productId, unitsInStock) {
    
}

export default {
    getProductsByName,
    updateProductInventory
}