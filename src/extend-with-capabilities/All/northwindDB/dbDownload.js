import fetch from 'node-fetch';
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';

// Script to download the entire Northwind database from the public OData service
const ODATA_SERVICE = "https://services.odata.org/V4/Northwind/Northwind.svc";
const TABLE_NAMES = ["Categories", "Customers", "Employees", "Order_Details", "Orders",
                     "Products", "Regions", "Suppliers", "Territories"];
// JSON files live in the same folder as this script
const directoryPath = dirname(fileURLToPath(import.meta.url));

// Each table gets its own JSON "database" to limit the need to write the whole
// database every time a table changes
for (let tableName of TABLE_NAMES) {

    // Set up the JSON db
    const file = join(directoryPath, `${tableName}.json`);
    const adapter = new JSONFile(file);
    const db = new Low(adapter);

    // Clear the data, copy the table, and write the result
    db.data = {};
    await copyTable(db, tableName);
    await db.write();

}

// Copy a table, iterating through pages of data as needed
async function copyTable(db, tableName) {

    if (!db.data[tableName]) db.data[tableName] = [];

    // Fetch first page of rows from OData
    let pageCount = 1;
    let rowCount, nextLink;
    [rowCount, nextLink] = await copyRows(db, `${ODATA_SERVICE}/${tableName}?$count=true`, tableName);

    // If there are more rows, read them
    while (nextLink) {
        [rowCount, nextLink] = await copyRows(db, `${ODATA_SERVICE}/${nextLink}`, tableName);
        pageCount++;
    }

    if (rowCount !== db.data[tableName].length) {
        console.log(`ERROR: Missing rows in ${tableName}`);
    }
    console.log(`Created ${tableName}.json with ${db.data[tableName].length} rows (${pageCount} page${pageCount>1?'s':''} downloaded)`);
}

// Copy a row
async function copyRows(db, url, tableName) {

    let response = await fetch(
        url,
        {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
    const tableData = await response.json();
    const rowCount = tableData["@odata.count"];
    let nextLink = tableData["@odata.nextLink"];

    for (let row of tableData.value) {
        db.data[tableName].push(row);
    }

    return [rowCount, nextLink];

}