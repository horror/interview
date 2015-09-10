var APP = {
    View_state: Backbone.Model.extend({
        defaults: {
            state: null,
            params: {},
        },
    }),

    Router: Backbone.Router.extend({

        initialize: function (options) {
            $.extend(this, options);
        },

        routes: {
            "!questions/(:id/)": "show_questions",
            "!start/": "show_start",
            "!editor/": "show_editor",
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
                state: "start"
            });
        },
        
        show_editor: function () {
            this.view_state.set({
                state: "editor"
            });
        },

        url_generators: {
            questions: function (vs) {
                var id = vs.get("params").q_id;
                return "!questions/" + (id != null ? (id + "/") : "");
            },
            start: function () {
                return "!start/"
            },
            editor: function () {
                return "!editor/"
            }
        },

        generate_url: function() {
            var vs = this.view_state;
            return this.url_generators[vs.get("state")](vs);
        },

        current : function() {
            var Router = this,
                    fragment = Backbone.history.fragment,
                    routes = _.pairs(Router.routes),
                    route = null, params = null, matched;

            matched = _.find(routes, function(handler) {
                route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
                return route.test(fragment);
            });

            if(matched) {
                // NEW: Extracts the params using the internal
                // function _extractParameters
                params = Router._extractParameters(route, fragment);
                route = matched[1];
            }

            return {
                route : route,
                fragment : fragment,
                params : params
            };
        }
    }),

    View_logic: Backbone.View.extend({
        el: "#wrapper",

        initialize: function (options) {
            $.extend(this, options);

            var AModel = Backbone.Model.extend({});
            var ACollection = Backbone.Collection.extend({
                model: AModel,
                url: '/?controller=interview&action=get_answers',
            });

            var QModel = Backbone.Model.extend({
                defaults: {
                    answers: [],
                    types: ["radio", "checkbox"]
                },
                categories: ["Розница", "Доставка", "Интернет магазин"],
                get_relative: function(direction) {
                    return this.collection.at(this.collection.indexOf(this) + direction);
                },
                get_category_name: function() {
                    return this.categories[this.get('category')];
                }
            });
            var QCollection = Backbone.Collection.extend({
                model: QModel,
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
                byCategories: function (categories) {
                    var filtered = this.select(function (q) {
                        return categories.indexOf(q.get('category')) !== -1;
                    });
                    filtered = filtered.map(function (i) {return i.attributes})
                    return new QCollection(filtered);
                }
            });

            var UserModel = Backbone.Model.extend({
                defaults: {
                    name: null
                },
                //localStorage: new Backbone.LocalStorage("user"),
                url: '/?controller=users&action=get_current',
            });

            var ClientModel = Backbone.Model.extend({
                defaults: {
                    name: null
                }
                //localStorage: new Backbone.LocalStorage("client")
            });

            var InterviewModel = Backbone.Model.extend({
                //localStorage: new Backbone.LocalStorage("client")
                defaults: {
                    question_id: null,
                    answer: null,
                },
            });
            var InterviewCollection = Backbone.Collection.extend({
                model: InterviewModel,
                id: 1,
                url: '/?controller=interview&action=save_interview',
                meta: {
                    user_id: null,
                    calling_date: null,
                    client: null,
                    client_phone: null,
                    shop: null,  
                    order_no: null,
                    product: null
                },
                question_categories: null,
                access: true,
                operator_shop_ref: {
                    0: [2,3,17,19,21,22,24,25],
                    1: [5,7,8,11,12,15,16,20],
                },
                _sync: function(method, model, options) {

                    if( model && (method === 'create' || method === 'update' || method === 'patch') ) {
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
                    
                    return Backbone.sync.apply( this, [method, model, options]);
                },
                
                save: function() {
                    this._sync('create', this, {
                        success: function() {
                            console.log('Saved!');
                        }
                    });
                }
                //save_local: function(){
                //    Backbone.sync('update', this, {});
                //},
                //localStorage: new Backbone.LocalStorage("interview")
            });

            this.question_list = new QCollection();
            this.answers_list = new ACollection();
            this.interview = new InterviewCollection();
            this.interview_hash = {};
            //this.interview.fetch();
            this.user = new UserModel({id: 1});
            //this.user.fetch();
            this.client = new ClientModel({id: 1});
            //this.client.fetch();
            this.view_state.bind('change', this.refresh, this);
            //this.interview.bind('add remove', this.refresh, this);
        },

        saveInterviewState: function () {
            var searchIDs = $("input:checkbox:checked").map(function(){
                return $(this).val()*1;
            }).get();
            if (searchIDs.length === 0)
                searchIDs.push(0);
            var other_answer = $("#other_answer").val();
            var d = $.Deferred();
     
            if (other_answer !== '') 
                $.post( 
                    "/?controller=interview&action=add_answer", 
                    {content: other_answer, question_id: this.view_state.get("params").q_id, type: 1}
                ).done(function(id) {
                    searchIDs.push(JSON.parse(id)*1);
                    d.resolve();
                });
            else {
                d.resolve();
                if (searchIDs.length === 0)
                    searchIDs.push(0);
            }
            var self = this;
            $.when(d.promise()).then(function () {
                self.interview_hash[self.view_state.get('params').q_id] = {
                    question_id: self.view_state.get('params').q_id,
                    answer: searchIDs
                };
            });
            
        },

        saveInterview: function () {
            var models = $.map(this.interview_hash, function(v) { return v; });
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
            ).done(function(result) {
                self.interview.access = JSON.parse(result);
                d.resolve();
            });
            
            return d.promise();
        },

        events: {
            //questions
            'click .nav' : function () {
                //this.interview.save_local();
            },

            'click .next' : function () {
                this.saveInterviewState();
            },
            'click #yes' : function (event) {
                event.preventDefault();
                $("#answers_1").hide();
                $("#answers_3").show();
            }, 
            'click #no' : function (event) {
                event.preventDefault();
                $("#answers_1").hide();
                $("#answers_" + 
                    (this.question_list.get(this.view_state.get('params').q_id).get("answers").length !== 0 ?
                    "2" :
                    "4")
                ).show();     
            }, 
            'click #abort' : function (event) {
                this.interview.add({
                    question: this.view_state.get('params').q_id,
                    answer: -1
                });
                this.saveInterview();
            }, 
            'click #save' : function (event) {
                this.saveInterviewState();
                this.saveInterview();
            }, 
            'click .last' : function (event) {
                event.preventDefault();
                this.saveInterviewState();
                this.saveInterview();
                $("#question").hide();
                $("#question_last").show();
                $(".last").removeClass("last").text("Закончить");
            }, 
            //start
            'click .start' : function (event) {
                event.preventDefault();
                var self = this;
                this.user.set({name: $("#user_name").val()});
                this.client.set({name: $("#client_name").val()});
                this.client.set({phone: $("#client_phone").val()});
                this.interview.meta.calling_date = $("#calling_date").val();
                this.interview.meta.shop = $("#shop").val();
                this.interview.meta.order_no = $("#order_no").val();
                this.interview.meta.product = $("#product").val();
                this.interview.question_categories = $("#question_categories").val().split(',');
                $.when(self.check_access()).then(function () { 
                    if (self.interview.access)
                        location.href = "#!questions/";
                    else
                        $("#msg_block").html('<span class="alert round label">Вы не имеете доступа к этому магазину по данной дате обзвона</span>');
                });
            },
            'click #question_categories' : function () {
                if ($("#question_categories").val() == 2)
                    $("#shop_block").hide()
                else
                    $("#shop_block").show();
            },
            'change #operator_type' : function () {
                $("#shop option").remove();
                _.each(this.interview.operator_shop_ref[$("#operator_type").val()], function (shop) {
                    $("#shop").append("\
                        <option value='" + shop + "'>СП-" + shop + "</option>"
                    );
                })
                
            },
            //editor
            'click #answer_add' : function (event) {
                event.preventDefault();
                $("#answers_list").append("\
                    <div class='answer_item'>\n\
                        <input type='checkbox' name='answers' class='answer'>\n\
                        <label>" + $("#answer_text").val() + "</label>\n\
                    </div>"
                );
                $("#answer_text").val('');
            },
            'click .answer_item' : function (event) {
                $(event.currentTarget).remove();
            },
            'click #question_add' : function (event) {
                //event.preventDefault();
                var q_text = $("#question_text").val();
                var answs = $(".answer_item label").map(function() {return $(this).html();}).get();
                var c = $("#question_category").val();
                $.post( "/?controller=interview&action=add_question", {content: q_text, category: c, a: answs});
            },
        },

        update_qestions: function () {
            var self = this;
            var d = $.Deferred();
            if (self.question_list.length === 0)
                self.question_list.fetch({
                    dataType: "json",
                    success: function(data) {
                        self.answers_list.fetch({
                            dataType: "json",
                            success: function(data) {
                                d.resolve();
                            },
                            error: function() {
                                console.log('error');
                            }
                        });                                              
                        console.log('success');
                    },
                    error: function() {
                        console.log('error');
                    }
                });
            else
                d.resolve();
            
            return d.promise();
        },
        
        wait_for_questions: function(callback) {
            var self = this;
            $.when(self.update_qestions()).then(function () {
                self.question_list.add_answers(self.answers_list);
                callback();
            });
        },

        refresh: function () {
            if (this.client.get("name") === null && this.view_state.get("state") !== "start")
                location.href = "/";
            
            var self = this;
            var d = $.Deferred();
            if (self.user.get("name") === null)
                self.user.fetch({
                    dataType: "json",
                    success: function(data) {
                        d.resolve();
                    },
                    error: function(e) {
                        location.href = "/";
                        console.log('error');
                    }
                });
            else
                d.resolve();
            
            $.when(d.promise()).then(function () {
                switch(self.view_state.get("state")) {
                    case "questions":
                        self.wait_for_questions(function () {
                            var qs = self.question_list.byCategories(self.interview.question_categories);
                            if (self.view_state.get("params").q_id === null)
                                self.view_state.get("params").q_id = qs.first().get("id");
                            self.render({questions: qs, c: self.client});
                        });
                        break;
                    case "start":
                        self.render({c: self.client});
                        $("#operator_type").val(0).change();
                        break;
                    
                    case "editor":
                        self.wait_for_questions(function () {
                            self.render({questions: self.question_list});
                        });
                        break;
                        
                    default: 
                        self.render({});
                        break;
                }
            });
        },

        render: function(params){
            $(this.el).html(
                _.template($('#' + this.view_state.get('state')).html())($.extend(params, {p: this.view_state.get('params')}, {u: this.user})) 
            );

            return this;
        },

        start: function (default_url) {
            var current = this.router.current();
            this.router.navigate(current.params !== null ? current.fragment : default_url, {trigger: true});
        }
    }),

    display : function () {
        var self = this;

        var view_state = new self.View_state();
        var router = new self.Router({ view_state: view_state });

        view_state.bind("change", function () {
            router.navigate(router.generate_url());
        });

        var view = new self.View_logic({
            view_state: view_state,
            router: router,
        });

        Backbone.history.start();
        view.start('!start/');
    }
}

$(function() {
    APP.display();
});