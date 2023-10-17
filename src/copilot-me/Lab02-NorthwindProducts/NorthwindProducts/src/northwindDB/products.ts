import {
    TABLE_NAME, Product
} from './model';

import { TableClient } from "@azure/data-tables";
import config from "../config";

// NOTE: We're force fitting a relational database into a non-relational database so please
// forgive the inefficiencies. This is just for demonstration purposes.

export const getProducts = async (startsWith: string): Promise<Product[]> => {

    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.PRODUCT);

    const entities = tableClient.listEntities();

    let result = [];
    for await (const entity of entities) {
        if (startsWith && (entity.ProductName as string).toLowerCase().startsWith(startsWith.toLowerCase())) {
            result.push(entity);
        }
    }
    return result;
};

// #region -- NOT TESTED ------------------------------------------------------------
export const getProduct = async (productId: number): Promise<Product> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.PRODUCT);
    const product = await tableClient.getEntity(TABLE_NAME.PRODUCT, productId.toString()) as Product;
    return product;
};

export const createProduct = async (product: Product): Promise<void> => {
    const newProduct: Product = {
        partitionKey: TABLE_NAME.PRODUCT,
        rowKey: product.ProductID,
        ...product,
    }
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.PRODUCT);
    await tableClient.createEntity(newProduct);
};

export const deleteProduct = async (productId: number): Promise<void> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.PRODUCT);
    await tableClient.deleteEntity(TABLE_NAME.PRODUCT, productId.toString());
};

export const updateProduct = async (updatedProduct: Product): Promise<void> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.PRODUCT);
    const product = await tableClient.getEntity(TABLE_NAME.CUSTOMER, updatedProduct.ProductID.toString()) as Product;
    if (!product) {
        throw new Error("Product not found");
    }
    await tableClient.updateEntity({ ...product, ...updatedProduct }, "Merge");
};

//#endregion


