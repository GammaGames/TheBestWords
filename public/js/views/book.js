var tbw = tbw || {};
tbw.Views = tbw.Views || {};

/*
twb.Views.Home()
====
extends __Common.Backbone.Model|Collection|View etc__
*/
tbw.Views.Book = Backbone.View.extend({
    el: "#book_wrapper",
    template: _.template($("#book_template").html()),
    event: {
    },

    initialize: function() {
        this.subViews = [];
        this.collection = new tbw.Collections.Submissions();
        this.listenTo(this.collection, "sync", this.render);
    },

    render: function() {
        var that = this;
        // $(this.el).empty();
        if(!$("#book").length) {
            $(this.el).append(this.template());
        }

        _.each(this.collection.models, function(submission, index) {
            that.subViews[submission.id] = new tbw.Views.Page({index: index + 1, submission: submission});
        });

        $("#book").booklet({
            width:  "200%",
            height: "100%",
            pagePadding: 0,
            pageNumbers: false,
            manual:   false,
            overlays: true,
            hovers:   true,
            keyboard: true,
            shadows: false,
            change: function(event, data){
                $("#left_button").removeClass("disabled");
                $("#right_button").removeClass("disabled");
                if(Math.floor(data.index) / 2 == 0) {
                    $("#left_button").addClass("disabled");
                }
                else if(Math.floor(data.index) / 2 == that.collection.length){
                    $("#right_button").addClass("disabled");
                }
            }
        });

        this.$el.hammer();
        $("#page_loader").removeClass("active");
    },

    removeSubViews: function() {
        var that = this;
        $("#book").booklet("destroy");
        _.each(this.collection.models, function(submission, index) {
            that.subViews[submission.id].remove();
        });
        this.subViews = [];
    },

    closeBook: function() {
        $("#book").booklet("gotopage", 0);
        $("#left_button").addClass("disabled");
    },

    getHot: function() {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
        }, 1000);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            that.collection.getHot();
        }, 1000);
    },

    getTop: function(time) {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
        }, 1000);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            that.collection.getTop(time);
        }, 1000);
    },

    getNew: function() {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
        }, 1000);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            that.collection.getNew();
        }, 1000);
    },

    next: function() {
        $("#book").booklet("next");
    },

    prev: function() {
        $("#book").booklet("prev");
    }
});
