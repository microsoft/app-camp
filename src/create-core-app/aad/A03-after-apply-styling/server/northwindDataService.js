import { dbService } from '../northwindDB/dbService.js';
const EMAIL_DOMAIN = "northwindtraders.com"; // For making fake email addresses for employees

const db = new dbService();     // Singleton service for Northwind DB

const employeeCache = {};
export async function getEmployee(employeeId) {

    if (employeeCache[employeeId]) return employeeCache[employeeId];

    const employees = await db.getTable("Employees", "EmployeeID");
    const orders = await db.getTable("Orders", "OrderID");
    const customers = await db.getTable("Customers", "CustomerID");

    const result = {};

    const employee = employees.item(employeeId);

    result.id = employee.EmployeeID;
    result.displayName = `${employee.FirstName} ${employee.LastName}`;
    result.mail = `${employee.FirstName}@${EMAIL_DOMAIN}`;
    result.photo = employee.Photo.substring(104); // Trim Northwind-specific junk
    result.jobTitle = employee.Title;
    result.city = `${employee.City}, ${employee.Region || ''} ${employee.Country}`;

    const employeeOrders = orders.data.filter((order) => order.EmployeeID === result.id);

    result.orders = employeeOrders.map((order) => {
        const customer = customers.item(order.CustomerID);
        return ({
            orderId: order.OrderID,
            orderDate: order.OrderDate,
            customerId: order.CustomerID,
            customerName: customer.CompanyName,
            customerContact: customer.ContactName,
            customerPhone: customer.Phone,
            shipName: order.ShipName,
            shipAddress: order.ShipAddress,
            shipCity: order.shipCity,
            shipRegion: order.ShipRegion,
            shipPostalCode: order.shipPostalCode,
            shipCountry: order.shipCountry
        });
    });

    employeeCache[employeeId] = result;
    return result;
}

const employeeNameCache = {};
export async function getEmployeeByLastName(lastName) {

    if (employeeNameCache[lastName]) return employeeNameCache[lastName];

    // This works only because lastname is unique in the Northwind sample
    // data. Remember this is only a lab!
    const employees = await db.getTable("Employees", "LastName");
    const employee = employees.item(lastName);

    const result = {
        id: employee.EmployeeID,
        displayName: `${employee.FirstName} ${employee.LastName}`,
        mail: `${employee.FirstName}@${EMAIL_DOMAIN}`,
        photo: employee.Photo.substring(104), // Trim Northwind-specific junk
        jobTitle: employee.Title,
        city: `${employee.City}, ${employee.Region || ''} ${employee.Country}`
    };

    employeeNameCache[lastName] = result;
    return result;
}

const orderCache = {}
export async function getOrder(orderId) {

    if (orderCache[orderId]) return orderCache[orderId];

    const result = {};

    const orders = await db.getTable("Orders", "OrderID");
    const orderDetails = await db.getTable("Order_Details", "OrderID");
    const customers = await db.getTable("Customers", "CustomerID");
    const employees = await db.getTable("Employees", "EmployeeID");
    const products = await db.getTable("Products", "ProductID");
    const categories = await db.getTable("Categories", "CategoryID");
    const suppliers = await db.getTable("Suppliers", "SupplierID");

    const order = orders.item(orderId);
    const customer = customers.item(order.CustomerID);
    const employee = employees.item(order.EmployeeID);

    result.orderId = orderId;
    result.orderDate = order.OrderDate;
    result.requiredDate = order.RequiredDate;
    result.customerName = customer.CompanyName;
    result.contactName = customer.ContactName;
    result.contactTitle = customer.ContactTitle;
    result.customerAddress = customer.Address;
    result.customerCity = customer.City;
    result.customerRegion = customer.Region || "";
    result.customerPostalCode = customer.PostalCode;
    result.customerPhone = customer.Phone;
    result.customerCountry = customer.Country;
    result.employeeId = employee.EmployeeID;
    result.employeeName = `${employee.FirstName} ${employee.LastName}`;
    result.employeeEmail = `${employee.LastName.toLowerCase()}@northwindtraders.com`;
    result.employeeTitle = `${employee.Title}`;

    const details = orderDetails.data.filter((item) => item.OrderID == orderId);

    result.details = details.map((item) => {
        const product = products.item(item.ProductID);
        const category = categories.item(product.CategoryID);
        const supplier = suppliers.item(product.SupplierID);
        return {
            productId: item.ProductID,
            productName: product.ProductName,
            categoryName: category.CategoryName,
            categoryPicture: category.Picture.substring(104), // Remove Northwind-specific junk
            quantity: item.Quantity,
            unitPrice: item.UnitPrice,
            discount: item.Discount,
            supplierName: supplier.CompanyName,
            supplierCountry: supplier.Country
        };
    });

    orderCache[orderId] = result;
    return result;
}

const categoriesCache = {};
export async function getCategories() {

    if (categoriesCache.data) return categoriesCache.data;

    const categories = await db.getTable("Categories", "CategoryID");

    const result = categories.data.map(category => ({
        categoryId: category.CategoryID,
        displayName: category.CategoryName,
        description: category.Description,
        picture: category.Picture.substring(104), // Remove Northwind-specific junk
    }));
    categoriesCache.data = result;
    return result;
}

const categoryCache = {};
export async function getCategory(categoryId) {

    if (categoryCache[categoryId]) return categoryCache[categoryId];

    const result = {};

    const categories = await db.getTable("Categories", "CategoryID");
    const products = await db.getTable("Products", "ProductID");
    const suppliers = await db.getTable("Suppliers", "SupplierID");

    const category = categories.item(categoryId);
    result.categoryId = category.CategoryID;
    result.displayName = category.CategoryName;
    result.description = category.Description;
    result.picture = category.Picture.substring(104); // Remove Northwind-specific junk

    const productsInCategory = products.data.filter(product => product.CategoryID == categoryId);

    result.products = productsInCategory.map((product) => {
        const supplier = suppliers.item([product.SupplierID]);
        return ({
            productId: product.ProductID,
            productName: product.ProductName,
            quantityPerUnit: product.QuantityPerUnit,
            unitPrice: product.UnitPrice,
            unitsInStock: product.UnitsInStock,
            unitsOnOrder: product.UnitsOnOrder,
            reorderLevel: product.ReorderLevel,
            supplierName: supplier.CompanyName,
            supplierCountry: supplier.Country,
            discontinued: product.Discontinued
        })
    }).sort((a, b) => a.productName.localeCompare(b.productName));

    categoryCache[categoryId] = result;
    return result;
}

const productCache = {};
export async function getProduct(productId) {

    if (productCache[productId]) return productCache[productId];

    const result = {};

    const products = await db.getTable("Products", "ProductID");
    const categories = await db.getTable("Categories", "CategoryID");
    const suppliers = await db.getTable("Suppliers", "SupplierID");
    const orders = await db.getTable("Orders", "OrderID");
    const orderDetails = await db.getTable("Order_Details", "OrderID");
    const customers = await db.getTable("Customers", "CustomerID");
    const employees = await db.getTable("Employees", "EmployeeID");

    const product = products.item(productId);
    const category = categories.item(product.CategoryID);
    const supplier = suppliers.item(product.SupplierID);

    result.productId = product.ProductID;
    result.productName = product.ProductName;
    result.categoryId = product.CategoryID;
    result.categoryName = category.CategoryName;
    result.quantityPerUnit = product.QuantityPerUnit;
    result.unitPrice = product.UnitPrice;
    result.unitsInStock = product.UnitsInStock;
    result.unitsOnOrder = product.UnitsOnOrder;
    result.reorderLevel = product.ReorderLevel;
    result.supplierName = supplier.CompanyName;
    result.supplierCountry = supplier.Country;
    result.discontinued = product.Discontinued;

    const details = orderDetails.data.filter((item) => item.ProductID == productId);

    result.orders = details.map((item) => {
        const order = orders.item(item.OrderID);
        const employee = employees.item(order.EmployeeID);
        const customer = customers.item(order.CustomerID);
    
        return {
            orderId: item.OrderID,
            orderDate: order.OrderDate,
            customerId: customer.CustomerID,
            customerName: customer.CompanyName,
            customerAddress: `${customer.Address}, ${customer.City} ${customer.Region || ""}, ${customer.Country}`,
            employeeId: order.EmployeeID,
            employeeName: `${employee.FirstName} ${employee.LastName}`,
            quantity: item.Quantity,
            unitPrice: item.UnitPrice,
            discount: item.Discount
        };
    });

    productCache[productId] = result;
    return result;
}
