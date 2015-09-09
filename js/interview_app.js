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
                getType: function() {
                    return this.get("types")[this.get("type")];
                },
                getRelative: function(direction) {
                    return this.collection.at(this.collection.indexOf(this) + direction);
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
                        self.get(a.get("question_id")).get("answers").push(a);
                    })
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
                user: null,
                //date: null,
                client: null,
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
                            meta: {
                                user_id: this.user,
                                //date: this.date,
                                client: this.client,
                            }
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
                    searchIDs.push(id);
                    d.resolve();
                });
            else {
                d.resolve();
                if (searchIDs.length === 0)
                    searchIDs.push(0);
            }
            self = this;
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
            this.interview.user = this.user.id;
            this.interview.client = this.client.get('name');
            //this.interview.date = new Date().getTime();
            this.interview.save();
            this.interview.reset();
            this.interview_hash = {};
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
            'click .start' : function () {
                this.user.set({name: $("#user_name").val()});
                this.client.set({name: $("#client_name").val()});
                //this.user.save_local();
                //this.client.save_local();
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
            self = this;
            var d = $.Deferred();
            if (self.question_list.length === 0)
                self.question_list.fetch({
                    dataType: "json",
                    success: function(data) {
                        if (self.view_state.get("params").q_id === null)
                            self.view_state.get("params").q_id = data.first().get("id");
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

        refresh: function () {
            var self = this;
            var d = $.Deferred()
            if (self.user.get("name") === null)
                self.user.fetch({
                    dataType: "json",
                    success: function(data) {
                        d.resolve();
                    },
                    error: function() {
                        location.href = "/";
                        console.log('error');
                    }
                });
            else
                d.resolve();
            
            $.when(d.promise()).then(function () {
                switch(self.view_state.get("state")) {
                    case "questions":
                        $.when(self.update_qestions()).then(function () {
                            self.question_list.add_answers(self.answers_list);
                            self.render({questions: self.question_list, c: self.client});
                        });
                        break;
                    case "start":
                        self.render({c: self.client});
                        break;
                    
                    case "editor":
                        $.when(self.update_qestions()).then(function () {
                            self.question_list.add_answers(self.answers_list);
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
            this.router.navigate(current.params != null ? current.fragment : default_url, {trigger: true});
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