//EXAMPLE AND DRAFT

var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

//Direct to index.html web page
server.get('/', restify.serveStatic({
    directory: __dirname,
    default: '/index.html'
}));

// Create chat bot
var connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
    // appId: '4294e391-35cd-4546-86a5-12e25f577e7e',
    // appPassword: '1nH8UqiKVtSfJOK3W8vCtev'
    appId: '',
    appPassword: ''
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================


bot.dialog('/', function (session) {
    session.send("Hello World2");
});