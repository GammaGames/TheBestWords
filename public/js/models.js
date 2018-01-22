var tbw = tbw || {};
tbw.Models = tbw.Models || {};

/*
tbw.Models
====
extends __Backbone.Model__
*/
tbw.Models.Submission = Backbone.Model.extend({
    defaults: {
        domain: null,
        num_reports: null,
        selftext_html: null,
        selftext: null,
        id: null,
        username: null,
        score: null,
        thumbnail: null,
        gilded: null,
        name: null,
        permalink: null,
        created_utc: null,
        url: null,
        title: null,
        num_comments: null,
        comments: []
    }
});

/*
tbw.Models.Comment
====
extends __Backbone.Model__
*/
tbw.Models.Comment = Backbone.Model.extend({
    defaults: {
        gilded: null,
        author: null,
        score: null,
        body: null,
        permalink: null,
        num_reports: null,
        created_utc: null,
        controversiality: null
    }
});

tbw.Models.Tweet = Backbone.Model.extend({
    defaults: {
        created_at: "Thu Jan 11 04:29:02 +0000 2018",
        id_str: "951309956720087041",
        text: "Good news: Toyota and Mazda announce giant new Huntsville, Alabama, plant which will produce over 300,000 cars and SUV’s a year and employ 4000 people. Companies are coming back to the U.S. in a very big way. Congratulations Alabama!",
        entities: null,
        user: {
            id: 25073877,
            name: 25073877,
            screen_name: "realDonaldTrump",
            location: "Washington, DC",
            description: "45th President of the United States of America",
            verified: true
        }
    }
});
