var tbw = tbw || {};
tbw.Views = tbw.Views || {};

/*
tbw.Views.About
====
extends __Backbone.View__
*/
tbw.Views.About = Backbone.View.extend({
    el: "#about_modal_container",
    template: _.template($("#about_modal_template").html()),

    initialize: function() {
        var that = this;
        if(!tbw.Views.About.cow) {
            $.get("http://api.thebestwords.io/cow", function(data) {
                tbw.Views.About.cow = data;
                that.render();
            });
        }
        else {
            this.render();
        }
    },

    render: function() {
        $(this.el).empty();
        $(this.el).append(this.template({cow: tbw.Views.About.cow}));
        $("#about_modal").modal({
            transition:'fade'
        });
        $("#about_modal:not(a)").on("click", this.hideModal);
        this.showModal();
    },

    showModal() {
        $("#about_modal").modal("show");
    },

    hideModal() {
        $("#about_modal").modal("hide");
        $("#about_modal:not(a)").off("click");
    }
});
