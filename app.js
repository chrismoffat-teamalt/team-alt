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
        builder.Prompts.choice(session, "What kind of insurance are you looking to claim?", ["Mortgage", "Personal Loan", "Royal Credit Line"]);   
    },
    function (session, results) {
        session.userData.type2 = results.response;
        builder.Prompts.text(session, "Last name:");
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
        session.userData.empcontactinfo= results.response;
        builder.Prompts.choice(session, "Self-employed (y/n):", ["Yes", "No"]);
    },
    function (session, result){
        session.userData.selfemp = results.response;
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