APP.view = Backbone.View.extend({
    el: "#wrapper",
    initialize: function (options) {
        $.extend(this, options);

        var AModel = Backbone.Model.extend({});
        var A_collection = Backbone.Collection.extend({
            model: AModel,
            url: '/?controller=interview&action=get_answers',
        });

        var categories = this.settings.categories;

        var Q_model = Backbone.Model.extend({
            defaults: {
                answers: []
            },
            get_relative: function (direction) {
                return this.collection.at(this.collection.indexOf(this) + direction);
            },
            get_category_name: function () {
                return categories[this.get('category')];
            },
            add_answer: function (a) {
                this.get('answers').push(a);
            }
        });
        var Q_collection = Backbone.Collection.extend({
            model: Q_model,
            url: '/?controller=interview&action=get_questions',
            add_answers: function (answs) {
                var self = this;
                this.each(function (q) {
                    q.set({answers: []});
                })
                answs.each(function (a) {
                    if (self.get(a.get("question_id")))
                        self.get(a.get("question_id")).get("answers").push(a);
                })
            },
            by_categories: function (categories) {
                var filtered = this.select(function (q) {
                    return categories.indexOf(q.get('category')) !== -1;
                });
                filtered = filtered.map(function (i) {
                    return i.attributes
                })
                return new Q_collection(filtered);
            }
        });

        var User_model = Backbone.Model.extend({
            defaults: {
                name: null
            },
            //localStorage: new Backbone.LocalStorage("user"),
            url: '/?controller=users&action=get_current',
        });

        var Client_model = Backbone.Model.extend({
            defaults: {
                name: null
            }
            //localStorage: new Backbone.LocalStorage("client")
        });

        var Interview_model = Backbone.Model.extend({
            //localStorage: new Backbone.LocalStorage("client")
            defaults: {
                question_id: null,
                answer: null,
            },
        });
        var Interview_collection = Backbone.Collection.extend({
            model: Interview_model,
            id: 1,
            url: '/?controller=interview&action=save_interview',
            meta: {
                user_id: null,
                calling_date: '',
                client: null,
                client_phone: null,
                operator: 0,
                shop: 2,
                order_no: null,
                product: null,
                answers_type: 0,
                question_categories: [0],
            },
            access: true,
            conut: 0,
            _sync: function (method, model, options) {

                if (model && (method === 'create' || method === 'update' || method === 'patch')) {
                    options.contentType = 'application/json';
                    options.data = JSON.stringify(options.attrs || model.toJSON());
                }

                options.data = JSON.stringify($.extend(
                        {
                            interview: JSON.parse(options.data)
                        },
                {
                    meta: this.meta
                }
                ));

                return Backbone.sync.apply(this, [method, model, options]);
            },
            save: function () {
                this._sync('create', this, {
                    success: function () {
                        console.log('Saved!');
                    }
                });
            }
            //save_local: function(){
            //    Backbone.sync('update', this, {});
            //},
            //localStorage: new Backbone.LocalStorage("interview")
        });

        this.question_list = new Q_collection();
        this.answers_list = new A_collection();
        this.interview = new Interview_collection();
        this.interview_hash = {};
        //this.interview.fetch();
        this.user = new User_model({id: 1});
        //this.user.fetch();
        this.client = new Client_model({id: 1});
        //this.client.fetch();
        this.view_state.bind('change', this.refresh, this);
        //this.interview.bind('add remove', this.refresh, this);
    },
    save_interview_state: function () {
        var self = this;
        var searchIDs = $("input[name='answers']:checkbox:checked").map(function () {
            return $(this).val() * 1;
        }).get();
        var other_answer = $("#other_answer").val();
        var d = $.Deferred();
        var q = this.view_state.get("params").q_id;
        var score = $("input[name='score']:radio:checked").val();
        if (other_answer !== '')
            $.post(
                    "/?controller=interview&action=add_answer",
                    {content: other_answer, question_id: q, type: 1}
            ).done(function (id) {
                var id = JSON.parse(id) * 1;
                searchIDs.push(id);
                self.answers_list.add({id: id, content: other_answer});
                self.question_list.get(q).add_answer(
                    self.answers_list.last()
                );
                d.resolve();
            });
        else {
            d.resolve();
            if ($("#answers_3").is(":visible"))
                searchIDs.push(self.settings.special_answers.yes_id);
        }

        $.when(d.promise()).then(function () {
            if (searchIDs.length === 0 && score === undefined)
                return;
            self.interview_hash[q] = {
                question_id: q,
                answer: searchIDs,
                score: self.interview.meta.answers_type ? score : null
            };
        });

    },
    save_interview: function () {
        var models = $.map(this.interview_hash, function (v) {
            return v;
        });
        this.interview.add(models);
        this.interview.meta.user_id = this.user.id;
        this.interview.meta.client = this.client.get('name');
        this.interview.meta.client_phone = this.client.get('phone');
        //this.interview.date = new Date().getTime();
        this.interview.save();
        this.interview.reset();
        this.interview_hash = {};
    },
    check_access: function () {
        var d = $.Deferred();
        var self = this;
        $.post(
                "/?controller=interview&action=check_access",
                {calling_date: this.interview.meta.calling_date, shop: this.interview.meta.shop}
        ).done(function (result) {
            self.interview.access = JSON.parse(result);
            d.resolve();
        });

        return d.promise();
    },
    show_default_answers: function () {
        $("#answers_" +
                (this.question_list.get(this.view_state.get('params').q_id).get("answers").length !== 0 ?
                        "2" :
                        "4")
                ).show();
    },
    hide_default_answers: function () {
        $("#answers_2").hide();
        $("#answers_4").hide();
    },
    update_url_params: function (params) {
        this.view_state.set({params: params}, {silent: true});
        window.history.pushState('', '', '#' + this.router.generate_url());
    },
    events: {
        //questions
        'click .nav': function () {
            $(".next").hide();
        },
        'click .next': function () {
            this.save_interview_state();
        },
        'change #other_answer': function () {
            $(".next").show();
        },
        'change .answers_checkbox': function () {
            $(".next").show();
        }, 
        'click #yes': function (event) {
            event.preventDefault();
            $("#answers_1").hide();
            $("#answers_1_score").hide();
            $("#answers_3").show();
            $(".next")[0].click();
        },
        'click #no': function (event) {
            event.preventDefault();
            $("#answers_1").hide();
            $("#answers_1_score").hide();
            this.show_default_answers();
        },
        'click #abort': function (event) {
            this.interview.add({
                question_id: this.view_state.get('params').q_id,
                answer: [this.settings.special_answers.no_id],
                score: null
            });
            this.save_interview();
        },
        'click #save': function (event) {
            this.save_interview_state();
            this.save_interview();
        },
        'click .last': function (event) {
            event.preventDefault();
            this.save_interview_state();
            this.save_interview();
            $("#question").hide();
            $("#question_last").show();
            $(".last").removeClass("last").text("Закончить");
            $(".prev").remove();
            $("#menu").remove();
        },
        'change .score': function (event) {
            if ($(event.currentTarget).val() <= this.settings.bad_scores_before)
                this.show_default_answers();
            else
                this.hide_default_answers();
            
            $(".next").show();
        },
        'click .disable': function (event) {
            event.preventDefault();
        },
        //start
        'click .start': function (event) {
            event.preventDefault();
            if ($(':input[required]:visible').filter(function () {
                return $(this).val() === ''
            }).length
                    ) {
                $("#msg_block").html('<span class="alert round label">Заполнены не все поля</span>');
                return;
            }
            var self = this;
            this.user.set({name: $("#user_name").val()});
            this.client.set({name: $("#client_name").val(), phone: $("#client_phone").val()});
            this.interview.meta.calling_date = $("#calling_date").val();
            this.interview.meta.shop = $("#shop").val();
            this.interview.meta.operator = $("#operator_type").val();
            this.interview.meta.order_no = $("#order_no").val();
            this.interview.meta.product = $("#product").val();
            this.interview.meta.answers_type = $("#answers_type").val();
            this.interview.meta.question_categories = $("#question_categories").val().split(',');
            $.when(self.check_access()).then(function () {
                if (self.interview.access)
                    location.href = "#!questions/";
                else
                    $("#msg_block").html('<span class="alert round label">Вы не имеете доступа к этому магазину по данной дате обзвона</span>');
            });
        },
        'change #operator_type': function () {
            $("#shop option").remove();
            _.each(this.settings.operator_shop_ref[$("#operator_type").val()], function (shop) {
                $("#shop").append("\
                    <option value='" + shop + "'>СП-" + shop + "</option>"
                        );
            })

        },
        //editor
        'click #answer_add': function (event) {
            event.preventDefault();
            $("#answers_list").append("\
                <div class='answer_item'>\n\
                    <input type='checkbox' name='answers' class='answer'>\n\
                    <label>" + $("#answer_text").val() + "</label>\n\
                </div>"
                    );
            $("#answer_text").val('');
        },
        'click .answer_item': function (event) {
            $(event.currentTarget).remove();
        },
        'click #question_add': function (event) {
            //event.preventDefault();
            var q_text = $("#question_text").val();
            var answs = $(".answer_item label").map(function () {
                return $(this).html();
            }).get();
            var c = $("#question_category").val();
            $.post("/?controller=interview&action=add_question", {content: q_text, category: c, a: answs});
        },
        'mousedown .dropable': function (event) {
            $(event.currentTarget).detectDrag();
        },
        'dragstart .dropable': function (event, data, clone, element) {
            
        },
        'dragend .dropable': function (event, clone, element) {
            
        },
        'drop .dropable': function (event, data, clone, element) {
            
        },
        //stats
        'click #add_series': function () {
            var series_params = {};
            series_params.parameter = $("#parameter").val();
            series_params.aggregation = $("#aggregation").val();
            series_params.group_by = $("#group_by").val();
            series_params.q_categories = $('input[name="q_categories"]:checked').map(function () {
                return $(this).val();
            }).get();
            series_params.q_types = $('input[name="q_types"]:checked').map(function () {
                return $(this).val();
            }).get();
            series_params.color = $("input[name='color']:checked").val();
            series_params.user = $("#user").val();
            series_params.shop = $("#shop").val();
            series_params.aborted = $("input[name='aborted']:checked").val();
            series_params.since_date = $("#since_date").val();
            series_params.before_date = $("#before_date").val();
            APP.charts.add_new_series(series_params);
            this.update_url_params(APP.charts.settings());
            this.render({chart: APP.charts});
        },
        'change #chart_type': function () {
            APP.charts.chart_type = $("#chart_type").val();
            this.update_url_params(APP.charts.settings());
            this.render({chart: APP.charts});
        },
        'click .delete_series': function (event) {
            APP.charts.delete_series($(event.currentTarget).data('series'));
            this.update_url_params(APP.charts.settings());
            this.render({chart: APP.charts});
        },
    },
    update_qestions: function () {
        var self = this;
        var d = $.Deferred();
        if (self.question_list.length === 0)
            self.question_list.fetch({
                dataType: "json",
                success: function (data) {
                    self.answers_list.fetch({
                        dataType: "json",
                        success: function (data) {
                            d.resolve();
                        },
                        error: function () {
                            console.log('error');
                        }
                    });
                    console.log('success');
                },
                error: function () {
                    console.log('error');
                }
            });
        else
            d.resolve();

        return d.promise();
    },
    wait_for_questions: function (callback) {
        var self = this;
        $.when(self.update_qestions()).then(function () {
            self.question_list.add_answers(self.answers_list);
            callback();
        });
    },
    refresh: function () {
        if (this.client.get("name") === null && this.view_state.get("state") === "questions")
            location.href = "/";


        var self = this;
        var d = $.Deferred();
        if (self.user.get("name") === null && self.view_state.get("state") !== "login")
            self.user.fetch({
                dataType: "json",
                success: function (data) {
                    d.resolve();
                },
                error: function (e) {
                    self.view_state.set({state: "login"})
                    console.log('error');
                }
            });
        else
            d.resolve();

        $.when(d.promise()).then(function () {
            switch (self.view_state.get("state")) {
                case "questions":
                    self.wait_for_questions(function () {
                        var qs = self.question_list.by_categories(self.interview.meta.question_categories);
                        if (self.view_state.get("params").q_id === null)
                            self.view_state.get("params").q_id = qs.first().get("id");
                        self.render({questions: qs, answers: self.answers_list, c: self.client, interview: self.interview, interview_hash: self.interview_hash});
                    });
                    break;

                case "start":
                    $.post(
                            "/?controller=stats&action=get_interviews_count",
                            {user_id: self.user.id, date: APP.utils.get_current_date()}
                    ).done(function (interview_cnt) {
                        self.interview.count = JSON.parse(interview_cnt);
                        self.render({});

                        $('#calling_date').fdatepicker({
                            format: 'yyyy-mm-dd'
                        });
                        $("#answers_type").val(self.interview.meta.answers_type).change();
                        $('#calling_date').val(self.interview.meta.calling_date);
                        $("#question_categories").val(self.interview.meta.question_categories.join(",")).change();
                        $("#operator_type").val(self.interview.meta.operator).change();
                        $("#shop").val(self.interview.meta.shop).change();

                        self.interview_hash = {};
                        self.interview.reset();
                    });

                    break;

                case "editor":
                    self.wait_for_questions(function () {
                        self.render({questions: self.question_list, categories: self.settings.categories});
                    });
                    break;

                case "stats":
                    $.post(
                            "/?controller=stats&action=get_interviews_list"
                            ).done(function (interviews_list) {
                        APP.charts.init(JSON.parse(interviews_list));
                        APP.charts.current_user = self.user;
                        APP.charts.settings(self.view_state.get('params'));
                        self.render({chart: APP.charts});
                    });

                    break;

                case "login":
                    self.render({msg: "Пожалуйста, авторизируйтесь!"});

                    break;
                    
                case "registr":
                    $.post("/?controller=users&action=get_users_list").done(function (users) {
                        self.render({users: JSON.parse(users)});
                    });
                    
                    break;

                default:
                    self.render({});
                    break;
            }
        });
    },
    
    template: function (name) {
        var tmpl = this.templates[name === undefined ? this.view_state.get('state') : name];
        return _.template(tmpl == undefined ? "" : tmpl);
    },
        
    render: function (params) {
        $(this.el).html(
                (this.view_state.get('state') !== "login" ?
                        this.template('top_menu')({menu: this.router.menu, interview_cnt: this.interview.count, u: this.user}) :
                        ""
                        ) +
                this.template()(
                $.extend(
                        params,
                        {p: this.view_state.get('params')},
                {u: this.user},
                {settings: this.settings}
                )
                )
                );

        return this;
    },
    start: function (default_url) {
        var current = this.router.current();
        this.router.navigate(current.params !== null ? current.fragment : default_url, {trigger: true});
    }
})
