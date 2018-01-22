const cors = require('cors');
const Reddit = require("../reddit");
const Twitter = require("../twitter");
const Aws = require("../aws");
const fs = require('fs');
const showdown = require('showdown');

var corsOptions = {
    origin: 'http://thebestwords.io',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
var converter = new showdown.Converter();

const reddit = new Reddit();
const twitter = new Twitter();

module.exports = function(app) {
    app.get('/top/:time?', cors(corsOptions), (req, res, next) => {
        var time = req.params.time || "week";
        req.url = '/cache' + req.url;
        next('route');
    });

    app.get('/hot', cors(corsOptions), (req, res, next) => {
        req.url = '/cache' + req.url;
        next('route');
    });

    app.get('/new', cors(corsOptions), (req, res, next) => {
        req.url = '/cache' + req.url;
        next('route');
    });

    app.get('/submission/:id', (req, res) => {
        var id = req.params.id || "week";
        var submission = reddit.getSubmission(id, function(data) {
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });
    });

    app.get('/feed', (req, res) => {
        var feed = twitter.getFeed(function(data) {
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });
    });

    app.get('/tweet/:id', (req, res) => {
        var feed = twitter.getTweet(req.params.id, function(data) {
            console.log("/tweet " + req.params.id);
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });
    });

    app.get(/cache\/.*$/, cors(corsOptions), function(req, res){
        console.log(req.url);
        fs.readFile(req.url.substr(1) + '.json', 'utf8', function(err, data) {
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-type', 'text/json');
            res.send(data);
        });
    });

    app.get('/cow/:id?', cors(corsOptions), (req, res) => {
        var tweets = [
            "918112884630093825",
            "869858333477523458",
            "951109942685126656",
            "951109942685126656",
            "865173176854204416",
            "848841326183534594",
            "848841326183534594",
            "847455180912181249",
            "847455180912181249",
            "931877599034388480",
            "931877599034388480",
            "929511061954297857",
            "929503641014112256",
            "928325667556548608",
            "918267396493922304",
            "911904261553950720",
            "911789314169823232",
            "905788459301908480",
            "901263061511794688",
            "901263061511794688",
            "886950594220568576",
            "885131482397908992",
            "885131482397908992",
            "878946025662296064",
            "949287555660500992",
            "875701471999864833",
            "936037588372283392"
        ];

        var id = req.params.id || tweets[Math.floor(Math.random() * tweets.length)];
        console.log(id);
        var feed = twitter.getTweet(id, function(data) {
            console.log("/cow " + id);
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-Type', 'text/plain');
            res.send(require('cowsay').say({
                text: data.full_text + "\r\n\t\t-@" + data.user.screen_name,
                g: true,
                f: "head-in",
                W: 40,
                wrap: true,
                wrapLength: 20
            }));
        });
    });

    app.get('/', (req, res) => {
        fs.readFile('readme.md', 'utf8', function(err, data) {
            console.log("/root");
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Content-type', 'text/plain');
            res.send(data);
        });
    });
}
