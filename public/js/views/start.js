var tbw = tbw || {};
tbw.Views = tbw.Views || {};

/*
twb.Views.Home()
====
extends __Common.Backbone.Model|Collection|View etc__
*/
tbw.Views.Start = Backbone.View.extend({
    el: "#main",
    template: _.template($("#start_template").html()),
    events: {
        "click #right_button": "nextPage",
        "click #left_button": "prevPage",
        "mouseenter #about_button": "aboutButton",
        "mouseleave #about_button": "aboutButton",
        "click #about_button": "aboutModal",
        "mouseenter #share_button:not(.disabled)": "shareButton",
        "mouseleave #share_button:not(.disabled)": "shareButton",
        "click #share_button:not(.disabled)": "shareModal",
        "mouseenter #bookmark_button": "bookmarkButton",
        "mouseleave #bookmark_button": "bookmarkButton",
        "mouseenter #right_button, #left_button": "pageButtons",
        "mouseleave #right_button, #left_button": "pageButtons",
        "swipeleft #book_wrapper": "nextPage",
        "swiperight #book_wrapper": "prevPage"
    },

    initialize: function() {
        this.subViews = [];
        this.render();
    },

    render: function() {
        $(this.el).empty();
        $(this.el).append(this.template());
        this.subViews["book"] = new tbw.Views.Book();
        $("#bookmark_button").dropdown({
            onShow: function() {
                $(".bookmark.icon").addClass("red");
            },
            onHide: function() {
                $(".bookmark.icon").removeClass("red");
            }
        }).dropdown("setting", "transition", "fade");
    },

    page: function(id) {
        this.subViews["book"].getPage(id);
    },

    hot: function() {
        this.subViews["book"].getHot();
    },

    top: function(time) {
        this.subViews["book"].getTop(time);
    },

    new: function() {
        this.subViews["book"].getNew();
    },

    nextPage: function() {
        this.subViews["book"].next();
    },

    prevPage: function() {
        this.subViews["book"].prev();
    },

    aboutButton: function(e) {
        if(e.type == "mouseenter") {
            $(e.currentTarget).find(".icon").first().addClass("blue");
        }
        else {
            $(e.currentTarget).find(".icon").first().removeClass("blue");
        }
    },

    shareButton: function(e) {
        if(e.type == "mouseenter") {
            $(e.currentTarget).find(".icon").first().addClass("green");
        }
        else {
            $(e.currentTarget).find(".icon").first().removeClass("green");
        }
    },

    bookmarkButton: function(e) {
        if(e.type == "mouseenter") {
            $(e.currentTarget).find(".icon").first().addClass("red");
        }
        else if(!$("#bookmark_button .menu").first().hasClass("visible")){
            $(e.currentTarget).find(".icon").first().removeClass("red");
        }
    },

    pageButtons: function(e) {
        if(e.type == "mouseenter") {
            $(e.currentTarget).find(".icon").addClass("grey");
        }
        else {
            $(e.currentTarget).find(".icon").removeClass("grey");
        }
    },

    aboutModal: function() {
        this.subViews["book"].closeBook();
        if(this.subViews["about"]) {
            this.subViews["about"].remove();
        }
        this.subViews["about"] = new tbw.Views.About();
    },

    shareModal: function() {
        if(this.subViews["share"]) {
            this.subViews["share"].remove();
        }
        var pageIndex = this.subViews["book"].index;
        this.subViews["share"] = new tbw.Views.Share({id: this.subViews["book"].collection.at(pageIndex - 1).get("id")});
    }
});
