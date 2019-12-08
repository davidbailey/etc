var options = { nick: 'peachbot', server: 'irc.freenode.net', port: 7000, channel: '#clowns', me: 'dabailey' } //set some options
var tls = require('tls'); //required for network/tls things
var http = require('http'); //required for http things
var fortunes = require('./fortune.js'); //required for fortune
var woot = new Array('','',''); //required for woot

var c = tls.connect(options.port,options.server); //connect to the irc server
c.write('NICK ' + options.nick + "\n"); //set the nick
c.write('USER ' + options.nick + " 0 * :peach.js\n"); //set the user
c.write('JOIN ' + options.channel + "\n"); //join the channel

c.on('data', function(chunk) { //when the servers sends the bot a message...
 console.log('data: ' + chunk); //output it to the console
 if (new String(chunk).substring(0,6) == "PING :") {c.write('PONG ' + new String(chunk).substring(6));} //pong if we get a ping
 else if (new String(chunk).match(new RegExp(":" + options.me + "!.+JOIN :.+"))) {c.write('MODE ' + options.channel + " +o " + options.me + "\r\nPRIVMSG " + options.channel + " :Hey" + options.me + "!\r\n");} // op and welcome me
 else if (new String(chunk).match(/:.+!.+JOIN :.+/)) {c.write('PRIVMSG ' + options.channel + " :Hey " + (new String(chunk).match(/:(.*)!/)[1] + "!\r\n"));} //welcome everyone else
 else if (new String(chunk).match(/:.+!.+:.+/))  {peach (new String(chunk).match(/^:([^!]+)/)[1], new String(chunk).match(/!.*:(.*)/)[1]);} //otherwise do something
})

function peach(nick, message) { //something to do

if (message.match(/hug\?/)) {c.write('PRIVMSG ' + options.channel + " :\u0001ACTION hugs " + nick + "\u0001\r\n");} //free hugs

//if (message.match(/!fortune/)) {c.write('PRIVMSG ' + options.channel + " :" + fortunes.tell() + "\n");} //read fortunes from fortune.js
if (message.match(/!fortune/)) {c.write('PRIVMSG ' + options.channel + " :" + fortunes.tell().replace(/\n/g,'\nPRIVMSG ' + options.channel + " :") + "\n");} //read fortunes from fortune.js

if (message.match(/!time/)) {var d = new Date(); c.write('PRIVMSG ' + options.channel + " :" + d.toString() + "\r\n");} //date

if (message.match(/!trojans/)) {
http.get({ host: 'www.google.com', path: '/search?q=usc+trojans+basketball', }, function(response) {
  response.on('data', function (chunk) {
  if (new String(chunk).match(/Last game: (.*)<tr>/)) {c.write('PRIVMSG ' + options.channel + " :" + new String(chunk).match(/Last game: (.*)<tr>/)[1].replace(/<(b|\/b)>/g,"") + "\r\n");} 
  });});} // usc trojans basketball score

if (message.match(/!dinner/)) {
http.get({ host: 'whatthefuckshouldimakefordinner.com', path: '/veg.php', }, function(response) {
  response.on('data', function (chunk) {
   if (new String(chunk).match(/(http.+)\"\ tar/)) {c.write('PRIVMSG ' + options.channel + " :" + new String(chunk).match(/(http.+)\"\ tar/)[1] + "\r\n");} 
  });});} //!dinner

if (message.match(/!weather (.*)/)) {
http.get({ host: 'xml.weather.yahoo.com', path: 'forecastrss?p=' + message.regex(/!weather (.*)/), }, function(response) {
 response.on('data', function (chunk) {
  if (new String(chunk).match(/.*/)) {c.write('PRIVMSG ' + options.channel + " :" + new String(chunk) + "\r\n");} 
 });});} 

if (message.match(/!tospanish (.*)/)) {
http.get({ host: 'ajax.googleapis.com', path: '/ajax/services/language/translate?v=1.0&q=' + escape(message.match(/!tospanish (.*)/)[1]) + '&langpair=en|es', }, function(response) {
  response.on('data', function (chunk) {
  eval("var translate =" +  new String(chunk));
  c.write('PRIVMSG ' + options.channel + " :" + translate.responseData.translatedText + "\r\n");
  });});} 

if (message.match(/!tofrench (.*)/)) {
http.get({ host: 'ajax.googleapis.com', path: '/ajax/services/language/translate?v=1.0&q=' + escape(message.match(/!tofrench (.*)/)[1]) + '&langpair=en|fr', }, function(response) {
  response.on('data', function (chunk) {
  eval("var translate =" +  new String(chunk));
  c.write('PRIVMSG ' + options.channel + " :" + translate.responseData.translatedText + "\r\n");
  });});} 

var pairings = { merlot: 'You, Sir, are an asshole.', malbec: 'ciabatta bread w/ apricot and butter :)', goat: 'double suck',  } 
if (message.match(/!pairing/)) {if (pairings[message.match(/!pairing (.+)/)[1]]) {c.write('PRIVMSG ' + options.channel + " :" + pairings[message.match(/!pairing (.+)/)[1]] + "\r\n");}}

var lunch = [ 'beach liquor', "rudy's", 'siam elephant', "esau's", 'the spot', 'cajun kitchen', 'sushi teri', 'pcc... rip dani', 'vons', 'in-n-out', "sly's", 'the palms', 'taco grande', 'padaro...rip' ] 
if (message.match(/!lunch/)) {c.write('PRIVMSG ' + options.channel + " :Why don't you try " + lunch.sort(function() {return 0.5 - Math.random()})[1] + "?\r\n");}

if (message.match(/!beer/)) {
 http.get({ host: 'google.com', path: '/search?q=site:beeradvocate.com+' + message.substring(6).replace(/ /,'+'), }, function(response) {
  response.on('data', function (chunk) {
   if (new String(chunk).match(/<a href="http:\/\/beeradvocate\.com(.+)" class=l onmousedown="return clk\(this\.href,'','','','1/)) {
    var path = new String(chunk).match(/<a href="http:\/\/beeradvocate\.com(.+)" class=l onmousedown="return clk\(this\.href,'','','','1/)[1];
    http.get({ host: 'beeradvocate.com', path: path, }, function(response) {
     response.on('data', function (chunk) {
      if (new String(chunk).match(/<span class="BAscore_big">(.)<\/span>/)) {c.write('PRIVMSG ' + options.channel + " :BA Score: " + new String(chunk).match(/<span class="BAscore_big">(.)<\/span>/)[1] + "\r\n");}
    });
   });
   }
  });
 });
}

if (message.match(/!peach/)) {
 c.write('PRIVMSG ' + options.channel + " :auto welcome everyone on JOIN\n");
 c.write('PRIVMSG ' + options.channel + " :hug?    | free hugs\n");
 c.write('PRIVMSG ' + options.channel + " :!trojans| usc basketball score\n");
 c.write('PRIVMSG ' + options.channel + " :!time   | current time\n");
 c.write('PRIVMSG ' + options.channel + " :!dinner | what's for dinner\n");
 c.write('PRIVMSG ' + options.channel + " :!fortune| FreeBSD fortune -o\n");
 c.write('PRIVMSG ' + options.channel + " :!pairing| merlot, malbec, goat\n");
}

//more http things: weather, stocks
}
setInterval(function() {
console.log('getting woot deal');
http.get({ host: 'www.woot.com', path: '/'}, function(response) {response.on('data', function (chunk) {if (new String(chunk).match(/<h2 class="fn">(.*)<\/h2>.*<span class="amount">(.*)<\/span><\/span>/)) {if (woot != new String(chunk).match(/<h2 class="fn">(.*)<\/h2>.*<span class="amount">(.*)<\/span><\/span>/)) {woot = new String(chunk).match(/<h2 class="fn">(.*)<\/h2>.*<span class="amount">(.*)<\/span><\/span>/);
c.write('PRIVMSG ' + options.channel + " :New woot! Deal: " + woot[1] + " $" + woot[2] + "\r\n");
};}});}).on('error', function(e) {console.log("error: " + e.message);});},3600000);
