var restify = require('restify');
var builder = require('botbuilder');
var appId;
var appPassword;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD    
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^unlock account/i, [
    function (session) {
        //session.beginDialog('/profile');
        session.beginDialog('/unlock');
    },
    function (session, results) {
        session.send('Ok... %s, account unlocked!', ntid);
        session.send('Can I help you with anything else?');
    }
]);

intents.matches(/\b(install|installation)\b/i, [
//intents.matches(/^installation/i, [
    function (session) {
        //session.beginDialog('/profile');
        session.beginDialog('/install');
    },
    function (session, results) {
        session.send('You can install %s from the Download Center http://itonline.kla-tencor.com/Pages/Download-Center.aspx', installApp);
        session.send('Can I help you with anything else?');
    }
]);

intents.matches(/\b(access)\b/i, [
//intents.matches(/^need access/i, [
    function (session) {
        session.beginDialog('/access');
    },
    function (session, results) {
        console.log(results);
        if (application.entity == "SAP") {
            session.send('To request access for %s please go to http://sapaccess', application.entity);
            session.send('Can I help you with anything else?');
        } else {
            session.send('To request access for %s please contact the Help Desk at 57979', application.entity);
            session.send('Can I help you with anything else?');
        }
    }
]);


intents.matches(/\b(done|quit|bye|no)\b/i, [
//intents.matches(/^need access/i, [
    function (session) {
        session.beginDialog('/quit');
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s! How can I help you today?', session.userData.name);        
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/unlock', [
    function (session) {
        builder.Prompts.text(session, 'What is your NT id?');
    },
    function (session, results) {
        ntid = results.response;
        //session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/access', [
    function (session) {
        //builder.Prompts.text(session, 'Which application do you need access for?');
        builder.Prompts.choice(session, "Which application do you need access for:", 'SAP|Non-SAP');
    },
    function (session, results) {
        application = results.response;
        session.endDialog();
    }
]);

bot.dialog('/install', [
    function (session) {
        builder.Prompts.text(session, 'Which application would you like to install?');
    },
    function (session, results) {
        installApp = results.response;
        //session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/quit', [
    function (session) {
        session.send('Bye %s! Have a great day!', session.userData.name);
        delete session.userData.name;
        session.endDialog();
    }
]);
