const { TableClient, TableServiceClient } = require("@azure/data-tables");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

(async () => {

    const COUNTRY_CODES = {
        "australia": "au",
        "brazil": "br",
        "canada": "ca",
        "denmark": "dk",
        "france": "fr",
        "germany": "de",
        "finland": "fi",
        "italy": "it",
        "japan": "jp",
        "netherlands": "nl",
        "norway": "no",
        "singapore": "sg",
        "spain": "es",
        "sweden": "se",
        "uk": "gb",
        "usa": "us"
    };
    // Get a flag image URL given a country name
    // Thanks to https://flagpedia.net for providing flag images
    function getFlagUrl(country) {

        return `https://flagcdn.com/32x24/${COUNTRY_CODES[country.toLowerCase()]}.png`;

    };

    const tableServiceClient = TableServiceClient.fromConnectionString("UseDevelopmentStorage=true");

    const tables = ["Categories", "Customers", "Employees", "Orders", "OrderDetails", "Products", "Suppliers"];
    const rowKeyColumnNames = ["CategoryID", "CustomerID", "EmployeeID", "OrderID", null, "ProductID", "SupplierID"];
    const generateImage = [false, true, false, false, false, true, true];
    const generateFlag = [false, true, false, false, false, false, true];

    tables.forEach(async (table) => {
        await tableServiceClient.deleteTable(table);
        console.log(`Deleted table: ${table}`);
    })
    tables.forEach(async (table) => {
        const rowKeyColumnName = rowKeyColumnNames[tables.indexOf(table)];
        const needImage = generateImage[tables.indexOf(table)];
        const needFlag = generateFlag[tables.indexOf(table)];

        await tableServiceClient.createTable(table);
        const tableClient = TableClient.fromConnectionString("UseDevelopmentStorage=true", table);
        const jsonString = fs.readFileSync(path.resolve(__dirname, "db", `${table}.json`), "utf8");
        const entities = JSON.parse(jsonString);
        for (const entity of entities[table]) {
            const rowKey = rowKeyColumnName ? entity[rowKeyColumnName].toString() : randomUUID();
            console.log(`Added entity to ${table} with key ${rowKey}`);

            if (needImage) {
                entity["ImageUrl"] = `https://picsum.photos/seed/${rowKey}/200/300`;
            }
            if (needFlag) {
                entity["FlagUrl"] = getFlagUrl(entity["Country"]);
            }
            await tableClient.createEntity({
                partitionKey: table,
                rowKey,
                ...entity
            });
        }
    });

})();