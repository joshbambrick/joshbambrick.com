/*
|-------------------------------------------
| app
|-------------------------------------------
|
| the instance of AppView which is added to the DOM
|
| type:     AppView
| author:   Josh Bambrick
| version:  0.0.1
| modified: 24/8/14
|
*/

define([
    'collections/articles.instance',
    'views/app'
], function (
    articles,
    AppView
) {
    return new AppView({collection: articles});
});