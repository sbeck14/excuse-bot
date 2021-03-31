if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  usage_tip();
}

var Botkit = require('botkit');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // debug: true,
    scopes: ['bot'],
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
if (process.env.DATABASE_URL) {
    var mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.DATABASE_URL});
    bot_options.storage = mongoStorage;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

webserver.get('/', function(req, res){
  res.render('index', {
    domain: req.get('host'),
    protocol: req.protocol,
    layout: 'layouts/default'
  });
})

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

const axios = require('axios');

controller.hears(['\\[insert excuse here\\]'], 'ambient', function(bot, message) {
  axios.get("http://www.ax11.de/bofh/index.php?plaintext")
  .then(response => {
      bot.reply(message, response.data);
  }).catch(err => {
      console.log(err);
  });
});

controller.hears(['\\[insert jargon here\\]'], 'ambient', function(bot, message) {
    bot.reply(message, rbs());
  });

function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Usage:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 node bot.js');
    console.log('~~~~~~~~~~');
}

var verbs = [
    "aggregate", "architect", "benchmark", "brand", "cultivate",
    "deliver", "deploy", "disintermediate", "drive", "e-enable",
    "embrace", "empower", "enable", "engage", "engineer",
    "enhance", "envisioneer", "evolve", "expedite", "exploit",
    "extend", "facilitate", "generate", "grow", "harness",
    "implement", "incentivize", "incubate", "innovate", "integrate",
    "iterate", "leverage", "matrix", "maximize", "mesh",
    "monetize", "morph", "optimize", "orchestrate", "productize",
    "recontextualize", "redefine", "reintermediate", "reinvent", "repurpose",
    "revolutionize", "scale", "seize", "strategize", "streamline",
    "syndicate", "synergize", "synthesize", "target", "transform",
    "transition", "unleash", "utilize", "visualize", "whiteboard"
]
var adjectives = [
    "24/365", "24/7", "B2B", "B2C",
    "back-end", "best-of-breed", "bleeding-edge", "bricks-and-clicks",
    "clicks-and-mortar", "collaborative", "compelling", "cross-platform",
    "cross-media", "customized", "cutting-edge", "distributed",
    "dot-com", "dynamic", "e-business", "efficient",
    "end-to-end", "enterprise", "extensible", "frictionless",
    "front-end", "global", "granular", "holistic",
    "impactful", "innovative", "integrated", "interactive",
    "intuitive", "killer", "leading-edge", "magnetic",
    "mission-critical", "next-generation", "one-to-one", "open-source",
    "out-of-the-box", "plug-and-play", "proactive", "real-time",
    "revolutionary", "rich", "robust", "scalable",
    "seamless", "sexy", "sticky", "strategic",
    "synergistic", "transparent", "turn-key", "ubiquitous",
    "user-centric", "value-added", "vertical", "viral",
    "virtual", "visionary", "web-enabled", "wireless", "world-class"
]
var nouns = [
    "action-items", "applications", "architectures", "bandwidth",
    "channels", "communities", "content", "convergence",
    "deliverables", "e-business", "e-commerce", "e-markets",
    "e-services", "e-tailers", "experiences", "eyeballs",
    "functionalities", "infomediaries", "infrastructures", "initiatives",
    "interfaces", "markets", "methodologies", "metrics",
    "mindshare", "models", "networks", "niches",
    "paradigms", "partnerships", "platforms", "portals",
    "relationships", "ROI", "synergies", "web-readiness",
    "schemas", "solutions", "supply-chains", "systems",
    "technologies", "users", "vortals", "web services"
]

function randomInt(low, high){
    return Math.floor(Math.random() * (high - low) + low);
}

function rbs() {
    var bs = verbs[randomInt(0, verbs.length - 1)];
    bs += ' ' + adjectives[randomInt(0, adjectives.length - 1)];
    bs += ' ' + nouns[randomInt(0, nouns.length - 1)];
    return bs;
}
