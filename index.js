var path = require('path');
var express = require('express');
var app = express();
var staticPath = path.join(__dirname, '.');
const PORT = process.env.PORT || 9090;

app.use(express.static(staticPath));

app.listen(PORT, function() {
	console.log(`=> 🔥  Borges Infinito dev web server is running on port ${PORT}`);
});