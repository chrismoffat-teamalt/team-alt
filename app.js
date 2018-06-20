/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

// //////// bot.beginDialog(address, 'survey');

bot.dialog('/', [
    function (session) {
        session.send("Hi! Thanks for taking the time to chat with RBC Insurance.");
        builder.Prompts.text(session, "Can I have your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.choice(session, "What kind of insurance are you looking to claim?", ["LoanProtecter", "BalanceProtecter", "HomeProtector", "Business Loan Insurance Plan"]);
    },
    function (session, results) {
        session.userData.insuranceType = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you are looking to claim " + session.userData.insuranceType + ".");
    },
    function(session, results) {
        session.send("Claim Form completion");
        // pull from OLB ?
        session.send("General Information – Must be completed by the Claimant");
        session.send("What is your Client Card No.");
        session.send("What is your Branch Transit No.");
        session.send("What is your Branch Telephone No.");       
    }

]);




// function (session, results) {
//     session.userData.insuranceType = results.response;
//     builder.Prompts.number(session, "Great! " + results.response + ", What kind of insurance are you looking to claim?"); 
// },
// function (session, results) {
//     session.userData.coding = results.response;
//     builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
// },
    // function (session, results) {
    //     session.userData.insuranceType = results.response.entity;
    //     builder.Prompts.number(session, "Great! " + results.response + ", What kind of insurance are you looking to claim?"); 
    // },
    // function (session, results) {
    //     session.userData.coding = results.response;
    //     builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    // },