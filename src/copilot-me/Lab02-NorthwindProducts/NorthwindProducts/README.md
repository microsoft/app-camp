# Lab Notes

This file is for notes about the lab instructions, to be used when writing the labs

## Lab 2 - Northwind Products

Note all steps that need to be included in the lab instructions here - except for code changes, which will be identified by comparing this folder with the Lab 1 folder. Note that this includes files within the .vscode folder (tasks.json).

```shell
npm install @azure/data-tables
npm install @microsoft/adaptivecards-tools
npm install azurite --save-dev
```

Add to .env.local:

~~~text
TABLE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
~~~

To set up the Azurite database:

1. Ensure Azurite is running; if necessary, open a console and run `npm run storage`
2. in a 2nd console, run `node ./scripts/db-setup.js`
3. check in Storage Explorer to be sure data is there
4. Shut consoles

## TODO For Lab 2

1. Add provisioning of table storage in Azure - works only locally now
