var tbw = tbw || {};
tbw.Views = tbw.Views || {};

/*
tbw.Views.Share
====
extends __Backbone.View__
*/
tbw.Views.Share = Backbone.View.extend({
    el: "#share_modal_container",
    template: _.template($("#share_modal_template").html()),

    initialize: function(options) {
        this.id = options.id;
        this.render();
    },

    render: function() {
        var that = this;
        $(this.el).empty();
        if($(".ui.modals #share_modal").length) {
            $(".ui.modals #share_modal").replaceWith(this.template({id: this.id}));
        }
        else {
            $(this.el).append(this.template({id: this.id}));
        }
        $("#share_modal").modal({
            transition:'fade',
            onHide: function() {
                router.navigate("#" + that.lastRoute, {trigger: false});
                $("#copy_button").off("click");
            }
        });
        new Clipboard('.button');
        this.showModal();
    },

    remove: function() {
        $("#share_modal").modal("destroy");
    },

    showModal() {
        $("#share_modal").modal("show");
        $("#copy_button").on("click", function() {
            $("#copy_button").popup({on: "manual", position: "bottom right"}).popup("show");
            setTimeout(function() {
                $("#copy_button").popup("hide")
            }, 1250);
        });
        this.lastRoute = Backbone.history.getFragment();
        router.navigate("#page/" + this.id, {trigger: false});
    },

    hideModal() {
        $("#share_modal").modal("hide");
    }
});
