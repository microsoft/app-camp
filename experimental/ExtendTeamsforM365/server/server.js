import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import {
  initializeIdentityService
} from './identityService.js';
import {
  getEmployee,
  getOrder,
  getCategories,
  getCategory,
  getProduct
} from './northwindDataService.js';
import {StockManagerBot} from './bot.js';
import { BotFrameworkAdapter } from 'botbuilder';
dotenv.config();
const app = express();

// JSON middleware is needed if you want to parse request bodies
app.use(express.json());
app.use(cookieParser());

// Allow the identity service to set up its middleware
await initializeIdentityService(app);

// Web service returns an employee's profile
app.get('/api/employee', async (req, res) => {

  try {
    const employeeId = req.query.employeeId;
    const employeeProfile = await getEmployee(employeeId);
    res.send(employeeProfile);
  }
  catch (error) {
      console.log(`Error in /api/employee handling: ${error}`);
      res.status(500).json({ status: 500, statusText: error });
  }

});

// Web service returns order details
app.get('/api/order', async (req, res) => {

  try {
    const orderId = req.query.orderId;
    const order = await getOrder(orderId);
    res.send(order);
  }
  catch (error) {
      console.log(`Error in /api/order handling: ${error}`);
      res.status(500).json({ status: 500, statusText: error });
  }

});

app.get('/api/categories', async (req, res) => {

  try {
    const categories = await getCategories();
    res.send(categories);
  }
  catch (error) {
      console.log(`Error in /api/categories handling: ${error}`);
      res.status(500).json({ status: 500, statusText: error });
  }

});

app.get('/api/category', async (req, res) => {

  try {
    const categoryId = req.query.categoryId;
    const categories = await getCategory(categoryId);
    res.send(categories);
  }
  catch (error) {
      console.log(`Error in /api/category handling: ${error}`);
      res.status(500).json({ status: 500, statusText: error });
  }

});

app.get('/api/product', async (req, res) => {

  try {
    const productId = req.query.productId;
    const product = await getProduct(productId);
    res.send(product);
  }
  catch (error) {
      console.log(`Error in /api/product handling: ${error}`);
      res.status(500).json({ status: 500, statusText: error });
  }

});


// Make some environment values available on the client side
// NOTE: Do not pass any secret or sensitive values to the client!
app.get('/modules/env.js', (req, res) => {
  res.contentType("application/javascript");
  res.send(`
    export const env = {
      HOSTNAME: "${process.env.HOSTNAME}",
      TENANT_ID: "${process.env.TENANT_ID}",
      CLIENT_ID: "${process.env.CLIENT_ID}",
      CONTACTS:"${process.env.CONTACTS}",
      ORIGINATOR:"${process.env.ORIGINATOR}"
    };
  `);
});

// Serve static pages from /client
app.use(express.static('client'));
const adapter = new BotFrameworkAdapter({
  appId: process.env.BOT_REG_AAD_APP_ID,
  appPassword:process.env.BOT_REG_AAD_APP_PASSWORD
});
const stockManagerBot = new StockManagerBot();
// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${ error }`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
      'OnTurnError Trace',
      `${ error }`,
      'https://www.botframework.com/schemas/error',
      'TurnError'
  );

  // Send a message to the user
  await context.sendActivity('The bot encountered an error or bug.');
  await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};
// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

app.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await stockManagerBot.run(context);
  }).catch(error=>{
    console.log(error)
  });
});

//start listening to server side calls
const PORT = process.env.PORT || 3978;
app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
