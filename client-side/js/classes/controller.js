APP.controller = { 
    View_state: Backbone.Model.extend({
        defaults: {
            state: null,
            params: {},
        },
    }),

    display : function (settings) {
        var self = this;

        var view_state = new self.View_state();
        var router = new APP.router({ view_state: view_state });

        view_state.bind("change", function () {
            router.navigate(router.generate_url());
        });

        var view = new APP.view({
            view_state: view_state,
            router: router,
            settings: settings,
        });

        Backbone.history.start();
        view.start('!start/');
    }
}