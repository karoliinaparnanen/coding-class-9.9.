// storing dependencies
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

//storing port number and our full app
var port = 3000;
var app = express();

// Step 1; setting up boilerplate and routing
app.get('/', function(req, res) {

  var url = 'https://en.wikipedia.org/wiki/Phyllotaxis';

  request(url, function(error, response, html) {

    if (!error) { // ! means if there is NO error

      //res.send(html);
      var $ = cheerio.load(html);
      var data = {
        articleTitle: '',
        articleImg: '',
        articleParagraph: ''
      };

      $('#content').filter(function() {

        data.articleTitle = $(this).find('#firstHeading').text();
        data.articleImg = $(this).find('img').first().attr('src');
        //  data.articleParagraph = $(this).find('h2').text();
        data.articleParagraph = $(this).find('p').first().text();
        //data.articleParagraph = $(this).find('a href').text();
        data.articleParagraph = $(this).find('.references').text();
      });

      res.send(data);

      fs.writeFile('wiki-output.js', JSON.stringify(data, null, 4), function(err) {
        console.log('File written on hard drive!');
      });
    }
  });
  // all the web scraping magic will happen here
  //res.send('Hello World!');
});

//IMDB example

app.get('/imdb', function(req, res) {

  var url = 'https://imdb.com/chart/top';

  request(url, function(error, response, html) {

    if (!error) { // ! means if there is NO error

      //res.send(html);
      var $ = cheerio.load(html);
      var data = [];

      $('.lister-list').filter(function(){
        $(this).find('tr').each(function(i, elem){
          data[i] = $(this).find('.posterColumn').find('img').attr('src');

        });
      });

      res.send(data);

    //  fs.writeFile('wiki-output.js', JSON.stringify(data, null, 4), function(err) {
        fs.writeFile('imdb-output.js', 'var imdb list + [' + data + ']', function(err) {
        console.log('File written on hard drive!');
      });
    }
  });
  // all the web scraping magic will happen here
  //res.send('Hello World!');
});

app.listen(port);
console.log('Magic happens on port ' + port);

exports = module.exports = app;
