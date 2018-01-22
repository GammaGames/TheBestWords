const config = require('config');
const cron = require('node-cron');
const Reddit = require("./app/reddit");
const Aws = require("./app/aws");
const moment = require('moment');
const writeFile = require('write');

const port = 8082;
global.redditAuth = config.get('reddit');
global.twitterAuth = config.get('twitter');
global.awsAuth = config.get('aws');
const aws = new Aws();
const reddit = new Reddit();

console.log("Server started: " + moment().toISOString());

cron.schedule('0 5-20 * * *', function(){
    reddit.getHot(function(data) {
        writeFile("cache/hot.json", JSON.stringify(data));
        aws.uploadFile("hot.json", function() {
            console.log("hot saved");
        });
    });
});

cron.schedule('5 5-20 * * *', function(){
    reddit.getTop("day", function(data) {
        writeFile("cache/top/day.json", JSON.stringify(data));
        aws.uploadFile("top/day.json", function() {
            console.log("top/day saved");
        });
    });
});

cron.schedule('10 5-20 * * *', function(){
    reddit.getTop("week", function(data) {
        writeFile("cache/top/week.json", JSON.stringify(data));
        aws.uploadFile("top/week.json", function() {
            console.log("top/week saved");
        });
    });
});

cron.schedule('15 5-20 * * *', function(){
    reddit.getTop("month", function(data) {
        writeFile("cache/top/month.json", JSON.stringify(data));
        aws.uploadFile("top/month.json", function() {
            console.log("top/month saved");
        });
    });
});

cron.schedule('20 5-20 * * *', function(){
    reddit.getTop("year", function(data) {
        writeFile("cache/top/year.json", JSON.stringify(data));
        aws.uploadFile("top/year.json", function() {
            console.log("top/year saved");
        });
    });
});

cron.schedule('25 5-20 * * *', function(){
    reddit.getTop("", function(data) {
        writeFile("cache/top/all.json", JSON.stringify(data));
        aws.uploadFile("top/all.json", function() {
            console.log("top/all saved");
        });
    });
});


cron.schedule('30 5-20 * * *', function(){
    reddit.getNew(function(data) {
        writeFile("cache/new.json", JSON.stringify(data));
        aws.uploadFile("new.json", function() {
            console.log("new saved");
        });
    });
});

// cron.schedule('*/10 5-20 * * *', function(){
//     aws.uploadCache();
// });

// aws.uploadCache();

reddit.getTop("", function(data) {
    writeFile("cache/top/all.json", JSON.stringify(data));
    aws.uploadFile("top/all.json", function() {
        console.log("top/all saved");
    });
});
