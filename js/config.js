$(function() {
    APP.display({
        bad_scores_before : 8,
        operator_shop_ref: [[2,3,17,19,21,22,24,25],[5,7,8,11,12,15,16,20]],
        categories: ["Розница", "Доставка", "Интернет магазин"],
        special_answers: {
            yes_id: 1,
            no_id: 2
        }
    });
});