APP.controller = {
    display: function (settings, templates) {
        
        var View_state = Backbone.Model.extend({
            defaults: {
                state: null,
                params: {},
            },
        });
        var view_state = new View_state();
        
        var router = new APP.router({view_state: view_state});

        view_state.bind("change", function () {
            router.navigate(router.generate_url());
        });

        var view = new APP.view({
            view_state: view_state,
            router: router,
            settings: settings,
            templates: templates,
        });

        Backbone.history.start();
        view.start('!start/');
    }
}