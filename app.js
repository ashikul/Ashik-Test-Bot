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

server.get('/home', restify.serveStatic({
    directory: './views',
    default: 'home.html'

}));

// Create chat bot
var connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId: 'e889783f-686c-423d-830f-023130abca47',
    appPassword: 'LpzNuMvpV0oUVqns0x2VVZQ'
    // appId: '',
    // appPassword: ''
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================


// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
// bot.beginDialogAction('help', '/help', { matches: /^help/i });


bot.dialog('/', [
    // function (session) {
    //     // Send a greeting and show help.
    //     // var card = new builder.HeroCard(session)
    //     //     .title("Microsoft Bot Framework")
    //     //     .text("Your bots - wherever your users are talking.")
    //     //     .images([
    //     //         builder.CardImage.create(session, "http://docs.botframework.com/images/demo_bot_image.png")
    //     //     ]);
    //     // var msg = new builder.Message(session).attachments([card]);
    //     // session.send(msg);
    //     // session.send("Hi... I'm the Microsoft Bot Framework demo bot for Facebook. I can show you everything you can use our Bot Builder SDK to do on Facebook.");
    //     session.beginDialog('/help');
    // },
    function (session, results) {

        // Display menu
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "We're excited to be of service to you", "Load Info|Auction|Quit");
    },
    function (session, results) {
        if (results.response && results.response.entity != 'Quit') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

// bot.dialog('/help', [
//     function (session) {
//         session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
//     }
// ]);

bot.dialog('/Load Info', [
    function (session) {
        // session.send("Welcome");
        builder.Prompts.text(session, "Please enter ship ID");
    },
    function (session, results) {
        // session.send("You entered '%s'", results.response);
        builder.Prompts.number(session, "Please enter manifest");
    },
    function (session, results) {
        // session.send("You entered '%s'", results.response);
        session.send("Load at: \n\n Pier#6  \n\n  Dock#3  \n\n Open:8AM  \n\n Close:9PM");
        // builder.Prompts.choice(session, "Prompts.choice()\n\nChoose a list style (the default is auto.)", "auto|inline|list|button|none");
        session.endDialog();
    },
    // function (session, results) {
    //     var style = builder.ListStyle[results.response.entity];
    //     builder.Prompts.choice(session, "Prompts.choice()\n\nNow pick an option.", "option A|option B|option C", { listStyle: style });
    // },
    // function (session, results) {
    //     session.send("You chose '%s'", results.response.entity);
    //     builder.Prompts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
    // },
    // function (session, results) {
    //     session.send("You chose '%s'", results.response ? 'yes' : 'no');
    //     builder.Prompts.time(session, "Prompts.time()\n\nThe framework can recognize a range of times expressed as natural language. Enter a time like 'Monday at 7am' and I'll show you the JSON we return.");
    // },
    // function (session, results) {
    //     session.send("Recognized Entity: %s", JSON.stringify(results.response));
    //     builder.Prompts.attachment(session, "Prompts.attachment()\n\nYour bot can wait on the user to upload an image or video. Send me an image and I'll send it back to you.");
    // },
    // function (session, results) {
    //     var msg = new builder.Message(session)
    //         .ntext("I got %d attachment.", "I got %d attachments.", results.response.length);
    //     results.response.forEach(function (attachment) {
    //         msg.addAttachment(attachment);
    //     });
    //     session.endDialog(msg);
    // }
]);

// bot.dialog('/file issue', [
//     function (session) {
//         session.send("You can easily send pictures to a user...");
//         var msg = new builder.Message(session)
//             .attachments([{
//                 contentType: "image/jpeg",
//                 contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
//             }]);
//         session.endDialog(msg);
//     }
// ]);

// bot.dialog('/cards', [
//     function (session) {
//         session.send("You can use either a Hero or a Thumbnail card to send the user visually rich information. On Facebook both will be rendered using the same Generic Template...");
//
//         var msg = new builder.Message(session)
//             .attachments([
//                 new builder.HeroCard(session)
//                     .title("Hero Card")
//                     .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
//                     .images([
//                         builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
//                     ])
//                     .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
//             ]);
//         session.send(msg);
//
//         msg = new builder.Message(session)
//             .attachments([
//                 new builder.ThumbnailCard(session)
//                     .title("Thumbnail Card")
//                     .subtitle("Pike Place Market is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
//                     .images([
//                         builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
//                     ])
//                     .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market"))
//             ]);
//         session.endDialog(msg);
//     }
// ]);

// bot.dialog('/list', [
//     function (session) {
//         session.send("You can send the user a list of cards as multiple attachments in a single message...");
//
//         var msg = new builder.Message(session)
//             .attachments([
//                 new builder.HeroCard(session)
//                     .title("Space Needle")
//                     .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
//                     .images([
//                         builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
//                     ]),
//                 new builder.HeroCard(session)
//                     .title("Pikes Place Market")
//                     .subtitle("Pike Place Market is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
//                     .images([
//                         builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
//                     ])
//             ]);
//         session.endDialog(msg);
//     }
// ]);

bot.dialog('/Auction', [
    function (session) {

        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Item 1")
                    .images([
                        builder.CardImage.create(session, "http://lorempixel.com/400/200/food/1")
                            .tap(builder.CardAction.showImage(session, "http://lorempixel.com/400/200/food/1")),
                    ])
                    .buttons([
                        // builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                        builder.CardAction.imBack(session, "bid:1", "Select")
                    ]),
                new builder.ThumbnailCard(session)
                    .title("Item 2")
                    .images([
                        builder.CardImage.create(session, "http://lorempixel.com/400/200/food/3")
                            .tap(builder.CardAction.showImage(session, "http://lorempixel.com/400/200/food/3")),
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "bid:2", "Select")
                    ]),
                new builder.ThumbnailCard(session)
                    .title("Item 3")
                    .images([
                        builder.CardImage.create(session, "http://lorempixel.com/400/200/food/5")
                            .tap(builder.CardAction.showImage(session, "http://lorempixel.com/400/200/food/5"))
                    ])
                    .buttons([
                        builder.CardAction.imBack(session, "bid:3", "Select")
                    ])
            ]);
        builder.Prompts.choice(session, msg, "bid:1|bid:2|bid:3");
    },
    function (session, results) {
        // var action, item;
        // var kvPair = results.response.entity.split(':');
        // switch (kvPair[0]) {
        //     case 'select':
        //         action = 'selected';
        //         break;
        // }
        // switch (kvPair[1]) {
        //     case '100':
        //         item = "the Space Needle";
        //         break;
        //     case '101':
        //         item = "Pikes Place Market";
        //         break;
        //     case '102':
        //         item = "the EMP Museum";
        //         break;
        // }
        // session.endDialog('You %s "%s"', action, item);
        session.endDialog("Bidding Info Coming Soon");
    }
]);

bot.dialog('/receipt', [
    function (session) {
        session.send("You can send a receipts for facebook using Bot Builders ReceiptCard...");
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg")),
                        builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method")
                    ])
                    .tax("$4.40")
                    .total("$48.40")
            ]);
        session.send(msg);

        session.send("Or using facebooks native attachment schema...");
        msg = new builder.Message(session)
            .sourceEvent({
                facebook: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "receipt",
                            recipient_name: "Stephane Crozatier",
                            order_number: "12345678902",
                            currency: "USD",
                            payment_method: "Visa 2345",
                            order_url: "http://petersapparel.parseapp.com/order?order_id=123456",
                            timestamp: "1428444852",
                            elements: [
                                {
                                    title: "Classic White T-Shirt",
                                    subtitle: "100% Soft and Luxurious Cotton",
                                    quantity: 2,
                                    price: 50,
                                    currency: "USD",
                                    image_url: "http://petersapparel.parseapp.com/img/whiteshirt.png"
                                },
                                {
                                    title: "Classic Gray T-Shirt",
                                    subtitle: "100% Soft and Luxurious Cotton",
                                    quantity: 1,
                                    price: 25,
                                    currency: "USD",
                                    image_url: "http://petersapparel.parseapp.com/img/grayshirt.png"
                                }
                            ],
                            address: {
                                street_1: "1 Hacker Way",
                                street_2: "",
                                city: "Menlo Park",
                                postal_code: "94025",
                                state: "CA",
                                country: "US"
                            },
                            summary: {
                                subtotal: 75.00,
                                shipping_cost: 4.95,
                                total_tax: 6.19,
                                total_cost: 56.14
                            },
                            adjustments: [
                                { name: "New Customer Discount", amount: 20 },
                                { name: "$10 Off Coupon", amount: 10 }
                            ]
                        }
                    }
                }
            });
        session.endDialog(msg);
    }
]);

// bot.dialog('/actions', [
//     function (session) {
//         session.send("Bots can register global actions, like the 'help' & 'goodbye' actions, that can respond to user input at any time. You can even bind actions to buttons on a card.");
//
//         var msg = new builder.Message(session)
//             .attachments([
//                 new builder.HeroCard(session)
//                     .title("Space Needle")
//                     .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
//                     .images([
//                         builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
//                     ])
//                     .buttons([
//                         builder.CardAction.dialogAction(session, "weather", "Seattle, WA", "Current Weather")
//                     ])
//             ]);
//         session.send(msg);
//
//         session.endDialog("The 'Current Weather' button on the card above can be pressed at any time regardless of where the user is in the conversation with the bot. The bot can even show the weather after the conversation has ended.");
//     }
// ]);
//
// // Create a dialog and bind it to a global action
// bot.dialog('/weather', [
//     function (session, args) {
//         session.endDialog("The weather in %s is 71 degrees and raining.", args.data);
//     }
// ]);
