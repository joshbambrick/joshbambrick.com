var port = 80,
    express = require('express'),
    app;

// Create the express app.
app = express();

// redirect to remove www.
app.use(function (req, res, next) {
    if (/www\./.test(req.headers.host)) {
        res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else {
        next();
    } 
});

// gzip
app.use(express.compress());

// support JSON, urlencoded, and multipart requests
app.use(express.bodyParser({
    uploadDir:'./uploads'
}));

// serve static files from public
app.use(express.static(__dirname + '/www'));

// all unmatched requests to this path, with no file extension, redirect to the dash page
app.use('/', function ( req, res, next ) {
    // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
    if (/\/[^.]*$/.test(req.url)) {
        res.sendfile(__dirname + '/www/index.html');
    } else {
        next();
    }
});

// 404 routes
app.use(function(req, res, next){
    res.status(404);

    if (req.accepts('html')) {
            // respond with html page
        res.sendfile(__dirname + '/www/404/index.html');
    } else if (req.accepts('json')) {
        // respond with json
        res.send({
            error: 'Not found'
        });
    } else {
        // send as plain text
        res.type('txt').send('Not found');
    }
});


app.listen(port, function () {
    console.log('Server listening on port ' + port);
});