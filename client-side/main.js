requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    baseUrl: '/client-side/',
    paths: {
        jquery: 'vendors/jquery-2.1.4.min',
        jqueryui: 'vendors/jquery-ui.min',
        underscore: 'vendors/underscore.min',
        backbone: 'vendors/backbone.min',
        datepicker: 'vendors/foundation-datepicker.min',
        jqflot: 'vendors/jquery.flot',
        jqflotaddon: 'vendors/jquery.flot.axislabels',
        jqflotpie: 'vendors/jquery.flot.pie',
        details: 'vendors/details-shim',
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'backbone'
        },
        waitSeconds: 15
    }
});
require([
    'underscore',
    'jquery',
    'details',
], function () {
    require([
        'jqueryui',
        'backbone',
        'datepicker',
        'jqflot',
        'APP',
    ], function () {
        require([
            //   'backbonestorage',
            'jqflotaddon',
            'jqflotpie',
            'classes/controller/router',
            'classes/controller/view',
            'classes/utils',
            'classes/charts',
        ], function () {
            require([
                'classes/controller',
                'config',
            ], function () {
                require([//we cant use this array because optimization module works only with hardcoded array constant. Proof http://requirejs.org/docs/optimization.html
                    'text!templates/start.html',
                    'text!templates/questions.html',
                    'text!templates/editor.html',
                    'text!templates/stats.html',
                    'text!templates/login.html',
                    'text!templates/registr.html',
                    'text!templates/top_menu.html',
                    'text!templates/kabinet.html',
                ], setup_app);
            });
        });
    });
});
