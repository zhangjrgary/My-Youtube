var mongoose = require("mongoose");
var uristring = process.env.MONGOLAB_URI || 'localhost';
var db = mongoose.createConnection(uristring,'abc');

//mongoose.connect( uristring );

var Schema = mongoose.Schema;
var Session = new Schema({
    session:String,
    playlist:[String]
});
//console.log("Events.js"+global.db === db);
module.exports = db.model("Sessions",Session,"Sessions");