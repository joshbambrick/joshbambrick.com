/*
|-------------------------------------------
| articles
|-------------------------------------------
|
| an array containing the data for all articles
|
| type:     Backbone.Collection
| author:   Josh Bambrick
| version:  0.0.1
| modified: 25/8/14
|
*/

define([], function () {
    return [{
        title: 'EnerGenius',
        type: 'carousel',
        pages: [{
            title: 'server'
        }, {
            title: 'web'
        }, {
            title: 'design'
        }, {
            title: 'mobile'
        }]
    }, {
        title: 'Agora',
        type: 'boring',
        content: 'i done an internship'
    }];
});