'use strict';
// constants
const vernoda = 'www.vernoda.com'
const schedule = require('node-schedule');
// var rule = new schedule.RecurrenceRule();
// // rule.minute = [20, 40, 59];
// rule.hour = [4, 8, 12, 16, 20, 23];
const fs = require("fs");
const snoowrap = require('snoowrap');
const r = new snoowrap({
  userAgent: 'vernoda redcarpet web app',
  clientId: 'ZUvRg8OcVsqtsg',
  clientSecret: 'yqAWDVCzg0wWPskFiJXUtboX1Js',
  username: 'drdawy',
  password: '@drda26978589'
});
const file = 'db.json';
let artworks = [];

// posting

function post (title, url) {
    r.getSubreddit('vernoda').submitLink({
    title: title,
    url: url
 });
}

// preparing data
function start(){

  artworks = JSON.parse(fs.readFileSync(file));
  let no = JSON.parse(fs.readFileSync('sorting.json'));
  let start = no.index
  let end = start+2 ;
  let postArr = artworks.slice(start, end);
  // console.log(postArr)
    for (let i = 0; i < postArr.length; i++) {
      let title = `${postArr[i].title} by ${postArr[i].artist}, see more: ${vernoda}`;
      let url = postArr[i].imgUrl ;
      console.log(title);
      console.log(url);
      start++
      post(title, url);
    }
    let newIndex = JSON.stringify({"index": start });
    console.log(newIndex);
    fs.writeFile('sorting.json', newIndex , function (err){
      if(err){
        console.log(err);
      }
    });
}

// start();
var j = schedule.scheduleJob('0 0 */4 * * *', function(){
  start();
});
