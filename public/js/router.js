var tbw = tbw || {};
tbw.Router = tbw.Router || {};

/*
tbw.Router.Router
====
extends __Backbone.Router__
*/
tbw.Router.Router = Backbone.Router.extend({
    routes: {
        'page/:id' : 'page',
        "hot": "hot",
        "top/:time": "top",
        "new": "new",
        '' : 'start',
        '*default' : 'defaultRoute',
    },

    page: function(id) {
        if(!this.view) {
            this.view = new tbw.Views.Start();
        }
        this.view.page(id);
    },

    hot: function() {
        if(!this.view) {
            this.view = new tbw.Views.Start();
        }
        this.view.hot();
    },

    top: function(time) {
        if(!this.view) {
            this.view = new tbw.Views.Start();
        }
        this.view.top(time);
    },

    new: function() {
        if(!this.view) {
            this.view = new tbw.Views.Start();
        }
        this.view.new();
    },

    start: function() {
        if(!this.view) {
            this.view = new tbw.Views.Start();
        }
        this.view.hot();
    },

    defaultRoute: function() {
        console.log("Route not handled!");
        router.navigate("", {trigger: true});
    },
});
