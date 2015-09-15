function setup_app(start_t, questions_t, editor_t, stats_t, login_t, registr_t, top_menu_t, kabinet_t) {
    APP.controller.display({
        bad_scores_before: 8,
        operator_shop_ref: [[2, 3, 17, 19, 21, 22, 24, 25], [5, 7, 8, 11, 12, 15, 16, 20]],
        categories: ["Розница", "Доставка", "Интернет магазин"],
        special_answers: {
            yes_id: 1,
            no_id: 2,
        }
    },
    {
        start: start_t,
        questions: questions_t,
        editor: editor_t,
        stats: stats_t,
        login: login_t,
        registr: registr_t,
        top_menu: top_menu_t,
        kabinet: kabinet_t,
    });
}
;