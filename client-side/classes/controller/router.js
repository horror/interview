APP.router = Backbone.Router.extend({
    initialize: function (options) {
        $.extend(this, options);
    },
    routes: {
        "!questions/(:id/)": "show_questions",
        "!start/": "show_start",
        "!editor/(:id/)": "show_editor",
        "!stats/(:params/)": "show_stats",
        "!login/": "show_login",
        "!registr/": "show_registr",
        "!kabinet/": "show_kabinet",
    },
    show_questions: function (id) {
        this.view_state.set({
            state: "questions",
            params: {
                q_id: id,
            }
        });
    },
    show_start: function () {
        this.view_state.set({
            state: "start",
        });
    },
    show_editor: function (id) {
        this.view_state.set({
            state: "editor",
            params: {
                q_id: id,
            }
        });
    },
    show_stats: function (params) {
        this.view_state.set({
            state: "stats",
            params: JSON.parse(params),
        });
    },
    show_login: function (params) {
        this.view_state.set({
            state: "login",
        });
    },
    show_registr: function (params) {
        this.view_state.set({
            state: "registr",
        });
    },
    show_kabinet: function (params) {
        this.view_state.set({
            state: "kabinet",
        });
    },
    url_generators: {
        questions: function (vs) {
            var id = vs.get("params").q_id;
            return "!questions/" + (id !== null ? (id + "/") : "");
        },
        start: function () {
            return "!start/"
        },
        editor: function (vs) {
            var id = vs.get("params").q_id;
            return "!editor/" + (id !== null ? (id + "/") : "");
        },
        stats: function (vs) {
            var p = vs.get("params");
            return "!stats/" + (p !== null ? (JSON.stringify(p) + "/") : "")
        },
        login: function () {
            return "!login/"
        },
        registr: function () {
            return "!registr/"
        },
        kabinet: function () {
            return "!kabinet/"
        },
    },
    menu: {
        "#!kabinet/": {title: 'Кабинет', role: 0},
        "#!start/": {title: 'Опросить', role: 0},
        "#!editor/": {title: 'Добавить вопрос', role: 1},
        "#!registr/": {title: 'Добавить пользователя', role: 1},
        "#!stats/": {title: 'Статистика', role: 0},
    },
    generate_url: function () {
        var vs = this.view_state;
        return this.url_generators[vs.get("state")](vs);
    },
    current: function () {
        var Router = this,
                fragment = Backbone.history.fragment,
                routes = _.pairs(Router.routes),
                route = null, params = null, matched;

        matched = _.find(routes, function (handler) {
            route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
            return route.test(fragment);
        });

        if (matched) {
            // NEW: Extracts the params using the internal
            // function _extractParameters
            params = Router._extractParameters(route, fragment);
            route = matched[1];
        }

        return {
            route: route,
            fragment: fragment,
            params: params
        };
    }
})