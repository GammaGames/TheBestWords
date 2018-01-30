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
        this.index = 0;
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
            speed: 500,
            manual:   false,
            overlays: true,
            hovers:   true,
            keyboard: true,
            shadows: false,
            change: function(event, data){
                $("#left_button").removeClass("disabled");
                $("#right_button").removeClass("disabled");
                var index = Math.floor(data.index) / 2;
                that.index = index;
                if(index == 0) {
                    $("#share_button").addClass("disabled");
                    $("#left_button").addClass("disabled");
                }
                else if(index == that.collection.length){
                    $("#right_button").addClass("disabled");
                }

                if(index > 0) {
                    $("#share_button").removeClass("disabled");
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
        this.index = 0;
    },

    closeBook: function() {
        $("#book").booklet("gotopage", 0);
        $("#left_button").addClass("disabled");
    },

    getPage: function(id) {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
            _.each(_.clone(that.collection.models), function(model) {
                that.collection.remove(model);
            });
        }, 50);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            var model;

            model = new tbw.Models.Submission({id: id});
            model.fetch({reset: true});
            that.listenTo(model, "sync", function() {
                that.collection.add(model);
                that.render();
                $("#book").booklet("gotopage", 2);
            });
        }, 250);
    },

    getHot: function() {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
        }, 750);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            that.collection.getHot();
        }, 750);
    },

    getTop: function(time) {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
        }, 750);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            that.collection.getTop(time);
        }, 750);
    },

    getNew: function() {
        var that = this;
        this.closeBook();
        setTimeout(function() {
            that.removeSubViews();
        }, 750);
        setTimeout(function() {
            $("#page_loader").addClass("active");
            that.collection.getNew();
        }, 750);
    },

    next: function() {
        $("#book").booklet("next");
    },

    prev: function() {
        $("#book").booklet("prev");
    }
});
