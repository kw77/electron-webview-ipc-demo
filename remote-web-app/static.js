var express = require('express');
var app = express();

app.use(express.static('static')); // NB: 0 = node, 1 = scriptname.js, 2 = first command line argument

app.listen(8888);