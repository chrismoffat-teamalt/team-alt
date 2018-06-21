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
        session.send("Hello, Team ALT!" +
                    " \r\n " + 
                    " \r\n " + 
                    "Welcome to myClaims Concierge. Thanks for taking the time to chat with RBC Creditor Insurance.");
                    builder.Prompts.choice(session, "What line of insurance are you looking to claim?", ["LoanProtecter", "BalanceProtecter", "HomeProtector", "Business Loan Insurance Plan"]);
    },
    function (session, results) {
        session.userData.insuranceType = results.response.entity;
        builder.Prompts.choice(session, "Insurance type?", ["Life", "Critical Illness", "Disability"]);
    },
    function(session, results) {
        session.userData.claimType = results.response.entity;
        builder.Prompts.choice(session, "Service line?", ["Mortgage", "Personal Loan", "Royal Credit Line"]);   
    
    },
    function (session, results){
        session.userData.selfemp = results.response.entity;

        session.send("Thank you for verifying your identity through RBC Online Banking."  +
                        " \r\n " + 
                        " \r\n One moment while I retrieve your information.");

        setTimeout(function(){ 

            // This would be pulled from OLB database/datalake
            session.send("Please verify the following..." + 
                        " \r\n " + 
                        " \r\n First Name:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "Team" +
                        " \r\n Last Name:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "ALT" +
                        " \r\n Client Card No:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "5555 5555 5555 5555" +
                        " \r\n Occupation:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "RBC" +
                        " \r\n Job Title:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "Cloud Innovation Challenge Winner" +
                        " \r\n Employer Contact No: 555 555 5555" +
                        " \r\n Address:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "6880 Financial Drive, Mississauga, On" +
                        " \r\n Branch Telephone No: 555 555 5555" +  
                        " \r\n Branch Transit No:" + "\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + "12345");

            builder.Prompts.choice(session, "Is this correct?", ["Yes", "No"]);

         }, 5000); 
    },
    function (session, results){
        session.userData.selfemp = results.response.entity;

        session.send("Thank you for verifying your information."  +
                    " \r\n " + 
                    " \r\n Your application has been started and is being processed. You can now view the progress in the new myClaim Tracker." +
                    " \r\n http://www.rbcroyalbank.ca/myClaimTracker");
        // Thanks the process is now submitted and being processing. 
        // You can view the claim tracker on your online banking dashboard
        // link to dashboard
    }
]);