// Require.js allows us to configure shortcut alias
require.config({
    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        // NOTE: must also keep GRUNTFILE.JS up to date
        jquery:                 'lib/jquery/jquery',
        jqueryBem:              'lib/jquery/jquery-bem',
        underscore:             'lib/underscore/underscore',
        'underscore-mixins':    'lib/underscore/underscore-mixins',
        backbone:               'lib/backbone/backbone',
        backboneBem:            'lib/backbone/backbone-bem'
    }
});

require([
    // force plugin-dependent plugins to run
    '../../dir-assets/scripts/lib/console/console',
    'jquery',
    'jqueryBem',
    'underscore',
    'underscore-mixins',
    'backbone',
    'backboneBem',
    'views/app.instance'
], function (
    console,
    $,
    jqueryBem,
    underscore,
    underscoreMixins,
    backbone,
    backboneBem,
    app
) {
    app.$el.appendTo('.main');
});