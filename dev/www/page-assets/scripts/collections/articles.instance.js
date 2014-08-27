/*
|-------------------------------------------
| articles
|-------------------------------------------
|
| the instance of ArticlesCollection which is contains all of the articles
|
| type:     ArticlesCollection
| author:   Josh Bambrick
| version:  0.0.1
| modified: 25/8/14
|
*/

define([
    'collections/articles',
    'content/articles'
], function (
    ArticlesCollection,
    articles
) {
    return new ArticlesCollection(articles);
});