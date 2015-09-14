var CHARTS =  {
    init: function (data) {
        this.series = [];
        this.series_params = [];
        this.chart_type = "line";
        this.colors = [
            'green',
            'black',
            'blue',
            'red',
            'orange',
            'yellow',
            'cyan',
            'magenta',
            'gray',
            'violet',
        ];
        this.series_id_generator = 0;
        var self = this;
        this.group_by = {
            q_categories: function (i) { return i.question_category },
        };

        this.group_by_xaxes_value = {
            q_categories: function (idx) { return idx; },
        };
        this.interviews_list = this.prepare(data.interviews_list);
        this.interview_logs = data.interview_logs;
        this.users = data.users;
    },
    
    prepare: function (i_list) {
        var list = [];
        for (var i in i_list) {
            var c = i_list[i].question_categories.split(",");
            for (var c_idx in c) 
                    list.push($.extend({question_category: c[c_idx]}, i_list[i]));
        }
        return list;
    }, 
    
    group_by_labels: {
        q_categories: "Категория вопросов",
    },

    q_categories: [
        'Розница',
        'Доставка',
        'Интернет магазин',
    ],

    statuses_color: {
        Розница: 'green',
        Доставка: 'yellow',
        'Интернет магазин': 'blue',
    },

    params_pack: function (p) {
        var result = _.clone(p);
        if (result.q_categories.length === _.keys(this.q_categories).length)
            delete result.q_categories;
        return result;
    },

    params_unpack: function (p) {
        var result = _.clone(p);
        result.q_categories = p.q_categories ? p.q_categories : _.keys(this.q_categories);
        return result;
    },

    settings: function(settings) {
        var self = this;
        if (settings !== undefined && settings !== null) {
            this.series = [];
            this.series_params = [];
            this.series = [];
            this.chart_type = settings.chart_type;
            _.each(settings.params, function (v) { self.add_new_series(v); });
        }
        return {chart_type: this.chart_type, params: _.map(this.series_params, function (v) { return v; })};
    },

    parameter_yaxes: {
        call_cnt: 1,
    },

    parameter_xaxes: {
        q_categories: 1,
    },

    add_new_series: function(params) {
        this.series_params.push(params);
        this.series.push({
            label: params.parameter,
            data: this.aggregate(this.simple_data(params), params),
            color: params.color !== undefined ? params.color : this.colors[this.series.length % this.colors.length],
            xaxis: this.parameter_xaxes[params.group_by],
            yaxis: this.parameter_yaxes[params.parameter],
            id: ++this.series_id_generator,
        });
    },

    series_pie_format: function() {
        var pies = [];
        var self = this;
        var series_idx = 0;
        _.each(this.series, function (s) {
            var pie = [];
            _.each(s.data, function (data) {
                pie.push({label: self.q_categories[data[0]], data: data[1]})
            });
            pies.push(pie);
            series_idx++;
        });

        return pies;
    },

    element_to_values: {
        call_cnt: function (cat) { return _.map(cat, function () { return 1; }); },
    },

    aggregate: function(chain, params) {
        var self = this;
        return chain.map(function(element, period_idx) {
            return [ self.group_by_xaxes_value[params.group_by](period_idx) ,
                self.aggregation[params.aggregation](self.element_to_values[params.parameter](element)) ];
        }).value();
    },

    simple_data: function(params) {
        var self = this;
        var q_categories = _.countBy(params.q_categories, _.identity);
        var q_types = _.countBy(params.q_types, _.identity);
        return _.chain(self.interviews_list).
            filter(function (i) {
                var f = q_categories[i.question_category] && 
                    q_types[i.answers_type] && 
                    (params.shop === null || i.shop === params.shop) &&
                    (new RegExp(params.user)).test(self.users[i.user_id].name);
                return f;
            }).
            groupBy(self.group_by[params.group_by]);
    },

    delete_series: function(seriesId) {
        var idx = _.findIndex(this.series, function (s) { return s.id === seriesId; });
        this.series.splice(idx, 1);
        this.series_params.splice(idx, 1);
    },

    aggregation: {
        sum: function(arr) { return arr.reduce(function(pv, cv) { return pv + cv; }, 0); },
        avg: function(arr) { return arr.reduce(function(pv, cv) { return pv + cv; }, 0) / arr.length; },
        min: _.min,
        max: _.max,
    },

    gen_submittions_per_problem_params: function () {
        var params = [];
        var contest = this.get_contest();
        _.each(contest.problems, function (id) {
            params.push({"period":10,"parameter":"run_cnt","aggregation":"sum","group_by":"status","problems":[id],"user":".*?","affiliation":".*?"});
        });
        return {"chart" : { params : params, chart_type: 'pie'}};
    }
}


