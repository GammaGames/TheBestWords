var tbw = tbw || {};
tbw.Collections = tbw.Collections || {};

/*
tbw.Collections.Submissions
====
extends __Backbone.Collection__
*/
tbw.Collections.Submissions = Backbone.Collection.extend({
    model: tbw.Models.Submission,

    initialize: function() {

    },

    getTop(time) {
        var that = this;
        $.get(server + "top" + (time ? "/" + time : ""), function(data) {
            that.set(data);
            that.trigger('sync');
        });
    },

    getHot() {
        var that = this;
        $.ajax({
            url: server + "hot",
            // This is the important part
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                that.set(response);
                that.trigger('sync');
            },
            error: function (xhr, status) {
                // handle errors
            }
        });
        // $.get(server + "hot", function(data) {
        //     that.set(data);
        //     that.trigger('sync');
        // });
    },

    getNew() {
        var that = this;
        $.get(server + "new", function(data) {
            that.set(data);
            that.trigger('sync');
        });
    }
});
