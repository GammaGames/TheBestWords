var tbw = tbw || {};
tbw.Views = tbw.Views || {};

/*
twb.Views.Home()
====
extends __Common.Backbone.Model|Collection|View etc__
*/
tbw.Views.Page = Backbone.View.extend({
    el: "#book",
    template: _.template($("#page_template").html()),

    initialize: function(options) {
        this.subViews = [];
        this.index = options.index;
        this.submission = options.submission;
        this.render();
    },

    remove: function() {
        this.stopListening();
        $("." + this.submission.get("id")).each(function(index, element) {
            $(element).remove();
        });
    },

    render: function() {
        $(this.el).append(this.template({index: this.index, submission: this.submission.toJSON()}));
    }
});
