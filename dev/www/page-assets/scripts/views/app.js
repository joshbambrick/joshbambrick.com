/*
|-------------------------------------------
| AppView
|-------------------------------------------
|
| the view of the app, an instance of which is added to the DOM
|
| type:         Class
| augments:     BackBone.View
| collection:   the articles to display
| author:       Josh Bambrick
| version:      0.0.1
| modified:     24/8/14
|
*/

define([
    'backbone',
    'views/nav',
    'views/sections'
], function (
    BackBone,
    NavView,
    SectionsView
) {
    return Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        render: function () {
            var nav, sections;

            nav = new NavView({collection: this.collection});
            sections = new SectionsView({collection: this.collection});

            this.$el.append(nav.$el).append(sections.$el);
        }
    });
});