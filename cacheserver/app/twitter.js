var twitternpm = require('twitter');
var moment = require('moment');
var Autolinker = require( 'autolinker' );

var method = Twitter.prototype;

function Twitter() {
    this.t = new twitternpm({
        consumer_key: global.twitterAuth.get("consumer_key"),
        consumer_secret: global.twitterAuth.get("consumer_secret"),
        bearer_token: global.twitterAuth.get("bearer_token")
    });
    this.autolinker = new Autolinker({truncate: { length: 32, location: 'smart' }, phone: false});
}

method.getTweet = function(id, callback) {
    var that = this;
    // this.startTime = moment();
    // console.log("Twitter tweet " + id + ": " + this.startTime.format("MM-DD-YYYY H:m:s"));

    var params = {id: id, tweet_mode: "extended"};
    this.t.get('statuses/show/', params, function(error, tweet, response) {
        if (!error) {
            if(typeof callback != 'undefined') {
                // console.log(moment().diff(that.startTime) / 1000 + ' seconds');
                callback(that.parseTweet(tweet));
            }
        }
        else {
            console.log(error);
        }
    });
}

method.parseTweets = function(tweets, callback) {
    var that = this;
    var results = [];

    tweets.forEach(function(tweet) {
        results.push(that.parseTweet(tweet));
    });
    if(typeof callback != 'undefined') {
        console.log(moment().diff(that.startTime) / 1000 + ' seconds');
        callback(results);
    }
}

method.parseTweet = function(tweet){
    var twit = {
        created_at: tweet.created_at,
        id_str: tweet.id_str,
        full_text: this.autolinker.link(tweet.full_text),
        entities: tweet.entities,
        user: {
            id: tweet.user.id,
            name: tweet.user.id,
            screen_name: tweet.user.screen_name,
            location: tweet.user.location,
            description: tweet.user.description,
            verified: tweet.user.verified
        }
    };
    return twit;
}

module.exports = Twitter;
