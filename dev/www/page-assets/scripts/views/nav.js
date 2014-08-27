/*
|-------------------------------------------
| NavView
|-------------------------------------------
|
| the view of the nav, an instance of which is added to the app
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
    'underscore',
    'backbone',
], function (
    _,
    BackBone
) {
    return Backbone.View.extend({
        tagName: 'nav',
        BEMClassName: 'nav',
        initialize: function () {
            this.render();
        },
        render: function () {
            this.collection.each(function (curArticle) {
                this.$el.append($('<div>').text(curArticle.get('title')));
            }, this);
        }
    });
});