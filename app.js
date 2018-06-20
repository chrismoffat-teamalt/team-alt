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

bot.dialog('/', [
    function (session) {
        session.send("Hi John! Thanks for taking the time to chat with RBC Insurance.");
        builder.Prompts.choice(session, "What line of creditor insurance are you looking to claim?", ["LoanProtecter", "BalanceProtecter", "HomeProtector", "Business Loan Insurance Plan"]);
    },
    function (session, results) {
        session.userData.insuranceType = results.response.entity;
        builder.Prompts.choice(session, "What kind of insurance are you looking to claim?", ["Life", "Critical Illness", "Disability"]);
    },
    function(session, results) {
        session.userData.claimType = results.response.entity;
        session.send("Thanks.");

        session.send("One moment while I retrieve your information.");

        while (Date.now() < start + 3000) {}

        // pulled from OLB 
        // session.send("Please verify the following information");
        session.send("Client Card No: 5555 5555 5555 5555" +
                        " \r\n Branch Transit No: 12345" +
                        " \r\n Branch Telephone No: 555 555 5555");    

        builder.Prompts.choice(session, "What kind of insurance are you looking to claim?", ["Mortgage", "Personal Loan", "Royal Credit Line"]);   
    },
    function (session, results) {
        session.userData.type2 = results.response.entity;
        builder.Prompts.text(session, "Last name: ");
    },
    function (session, results) {
        session.userData.lastname = results.response;
        builder.Prompts.text(session, "Occupation:");
    },
    function (session, results) {
        session.userData.occupation= results.response;
        builder.Prompts.text(session, "Most recent job:");
    },
    function (session, results) {
        session.userData.mostrecentjob = results.response;
        builder.Prompts.text(session, "Employer:");
    },
    function (session, results) {
        session.userData.employer = results.response;
        builder.Prompts.text(session, "Employer contact info:");
    },
    function (session, results) {
        session.userData.empcontactinfo = results.response;
        builder.Prompts.choice(session, "Self-employed:", ["Yes", "No"]);
    },
    function (session, results){
        session.userData.selfemp = results.response.entity;
        builder.Prompts.choice(session, "Self-employed:", ["Yes", "No"]);
        // Thanks the process is now submitted and being processing. 
        // You can view the claim tracker on your online banking dashboard
        // link to dashboard

    }

]);

//  

// Disability Claimant Information – Must be completed by Claimant

// What is your Initial

// What is your Last Name

// What is your Maiden Name (if applicable)  

 
// Tell us about your most recent job:

// What is your occupation

// Are you self-employed  yes/no

// Are you seasonally employed yes/no

 

// What is the name of your employer?

// When did your start at your job?  Month/Day/Year

// What is name of your supervisor (who can we contact to verify this information)

// What is your employer’s address?

// Street and number

// City or Town

// Province




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