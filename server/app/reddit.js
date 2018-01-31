var snoowrap = require('snoowrap');
var showdown = require('showdown');
var moment = require('moment');
var parse = require('twitter-url-parser');
var Autolinker = require( 'autolinker' );
const Twitter = require("./twitter");
var forAsync = require('for-async');

var method = Reddit.prototype;

function Reddit() {
    this.r = new snoowrap({
        userAgent: global.redditAuth.get("userAgent"),
        clientId: global.redditAuth.get("clientId"),
        clientSecret: global.redditAuth.get("clientSecret"),
        refreshToken: global.redditAuth.get("refreshToken")
    });
    this.twitter = new Twitter();
    this.autolinker = new Autolinker({truncate: { length: 32, location: 'smart' }, phone: false});
}

method.getTop = function(time, callback) {
    var that = this;
    this.startTime = moment();
    console.log("Reddit top: " + this.startTime.format("MM-DD-YYYY HH:mm:ss"));
    var topSubmissions = that.r.getSubreddit('TrumpCriticizesTrump').getTop({time: time}).then(submissions => {
        that.parseSubmissions(submissions, callback);
    });
}

method.getHot = function(callback) {
    var that = this;
    this.startTime = moment();
    console.log("Reddit hot: " + this.startTime.format("MM-DD-YYYY H:m:s"));
    var hotSubmissions = that.r.getSubreddit('TrumpCriticizesTrump').getHot().then(submissions => {
        that.parseSubmissions(submissions, callback);
    });
}

method.getNew = function(callback) {
    var that = this;
    this.startTime = moment();
    console.log("Reddit new: " + this.startTime.format("MM-DD-YYYY H:m:s"));
    var newSubmissions = that.r.getSubreddit('TrumpCriticizesTrump').getNew().then(submissions => {
        that.parseSubmissions(submissions, callback);
    });
}

method.getSubmission = function(id, callback) {
    var that = this;
    this.startTime = moment();
    console.log("Reddit submission " + id + ": " + this.startTime.format("MM-DD-YYYY H:m:s"));
    var submission = that.r.getSubmission(id).fetch().then(submission  => {
        that.parseSubmission(submission, callback);
    });
}

method.parseSubmission = function(submission, callback) {
    var that = this;
    submission.expandReplies({limit: Infinity, depth: 1}).then(submission => {
        var post = {
            domain: submission.domain,
            num_reports: submission.num_reports,
            selftext_html: that.autolinker.link(autosubmission.selftext_html),
            selftext: submission.selftext,
            id: submission.id,
            username: submission.author.name,
            score: submission.score,
            thumbnail: submission.thumbnail,
            gilded: submission.gilded,
            name: submission.name,
            permalink: submission.permalink,
            created_utc: submission.created_utc,
            url: submission.url,
            tweet_id: parse(submission.url).id,
            title: submission.title,
            num_comments: submission.num_comments,
            comments: that.getSubmitterComments(submission.comments)
        };

        that.twitter.getTweet(post.tweet_id, function(data) {
            post.tweet = that.twitter.parseTweet(data);
            (moment().diff(that.startTime) / 1000 + ' seconds');
            if(typeof callback != 'undefined') {
                callback(post);
            }
        });
    });
}

method.parseSubmissions = function(submissions, callback) {
    var that = this;
    var posts = [];
    forAsync(submissions, function(submission) {
        return new Promise(function(resolve){
            if(submission.domain == "twitter.com") {
                submission.expandReplies({limit: Infinity, depth: 1}).then(submission => {
                    var post = {
                        domain: submission.domain,
                        num_reports: submission.num_reports,
                        selftext_html: that.autolinker.link(submission.selftext_html),
                        selftext: submission.selftext,
                        id: submission.id,
                        username: submission.author.name,
                        score: submission.score,
                        thumbnail: submission.thumbnail,
                        gilded: submission.gilded,
                        name: submission.name,
                        permalink: submission.permalink,
                        created_utc: submission.created_utc,
                        url: submission.url,
                        tweet_id: parse(submission.url).id,
                        title: submission.title,
                        num_comments: submission.num_comments,
                        comments: that.getSubmitterComments(submission.comments)
                    };

                    that.twitter.getTweet(post.tweet_id, function(data) {
                        post.tweet = that.twitter.parseTweet(data);
                        if(post.comments.length && post.tweet.user.screen_name.toLowerCase() == "realdonaldtrump") {
                            posts.push(post);
                        }
                        resolve(); // <-- signals that this iteration is complete
                    });
                });
            }
            else {
                resolve(); // <-- signals that this iteration is complete
            }
        });
    }).then(function() {
        console.log(moment().diff(that.startTime) / 1000 + ' seconds');
        if(typeof callback != 'undefined') {
            callback(posts);
        }
    });
}

method.getSubmitterComments = function(comments) {
    var that = this;
    var converter = new showdown.Converter();
    var results = [];
    comments.forEach(function(comment) {
        if(comment.is_submitter) {
            var trimmedComment = {
                gilded: comment.gilded,
                author: comment.author.name,
                score: comment.score,
                body: that.autolinker.link(converter.makeHtml((comment.body.toLowerCase().match(/^.{0,2}context.{0,2}/) ? "" : "Context: ") + comment.body).replace(/\n/g, "")),
                permalink: comment.permalink,
                num_reports: comment.num_reports,
                created_utc: comment.created_utc,
                controversiality: comment.controversiality
            }
            results.push(trimmedComment);
        }
    });
    return results;
}

module.exports = Reddit;
