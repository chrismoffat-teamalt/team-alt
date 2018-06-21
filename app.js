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
        session.send("Hi Team ALT! Thanks for taking the time to chat with RBC Insurance.");
        builder.Prompts.choice(session, "What line of creditor insurance are you looking to claim?", ["LoanProtecter", "BalanceProtecter", "HomeProtector", "Business Loan Insurance Plan"]);
    },
    function (session, results) {
        session.userData.insuranceType = results.response.entity;
        builder.Prompts.choice(session, "Insurance type?", ["Life", "Critical Illness", "Disability"]);
    },
    function(session, results) {
        session.userData.claimType = results.response.entity;
        builder.Prompts.choice(session, "Service line?", ["Mortgage", "Personal Loan", "Royal Credit Line"]);   
        
        session.send("Thanks for verifying your identity through RBC Online Bankking."  +
                        " \r\n One moment while I retrieve your information.");

        // This would be pulled from OLB database/datalake

        session.send("Please verify the following..." + 
                        " \r\n First Name: Team" +
                        " \r\n Last Name: ALT" +
                        " \r\n Client Card No: 5555 5555 5555 5555" +
                        " \r\n Occupation: RBC" +
                        " \r\n Job Title: Cloud Innovation Challenge Winner" +
                        " \r\n Employer Contact No: 555 555 5555" +
                        " \r\n Address: 6880 Financial Drive, Mississauga, On" +
                        " \r\n Branch Telephone No: 555 555 5555" +  
                        " \r\n Branch Transit No: 12345");
    },
    function (session, results){
        session.userData.selfemp = results.response.entity;
        builder.Prompts.choice(session, "Is this correct?", ["Yes", "No"]);

        // Thanks the process is now submitted and being processing. 
        // You can view the claim tracker on your online banking dashboard
        // link to dashboard
    },
    function (session, results){
        session.userData.selfemp = results.response.entity;

        session.send("Thanks for verifying your information."  +
        " \r\n The application is being processed." + 
        " \r\n You can view the progress of your applicatin in myClaim Tracker.");

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