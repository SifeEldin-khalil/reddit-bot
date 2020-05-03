//constants
const fetch = require("node-fetch");
const fs = require("fs");
const baseUrl = 'https://www.vernoda.com/api/products?page=';
const file = 'db.json'
let artworks = [];
const schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.hour = [9, 21];

// checking update

function updateArtworks(pageNumber) {
  fetch(baseUrl+pageNumber)
    .then(response => {
      return response.json()
    })
    .then(data => {
        let artSize = data.payload.products.length ;
        let nextPage = data.payload.pagination.next ;
        let firstId = artworks[0].id ;
        let isUpdated = false ;
        let index = JSON.parse(fs.readFileSync('sorting.json')).index;
        console.log(index);

        for (let i = 0 ; i < artSize  ; i++) {
        let artwork = {} ;
          artwork.id = data.payload.products[i]._id ;
          artwork.title = data.payload.products[i].title ;
          artwork.desc = data.payload.products[i].desc ;
          artwork.imgUrl = data.payload.products[i].mainImage ;
          artwork.artist = data.payload.products[i].createdBy.fullname ;
          artwork.cat = data.payload.products[i].category.label ;
          if(artwork.id !== firstId){
            artworks.splice(index, 0, artwork);
            // artworks.push(artwork);
          }else{
            isUpdated = true;
            break ;
          }
        }
        console.log(`page is done`)
        if (isUpdated == false){
          updateArtworks(nextPage);
        }else {
          console.log(artworks.length);
          // console.log(artworks);
          console.log(`break at page: ${pageNumber} and data is updated`)
          let jsonArtWorks = JSON.stringify(artworks);
          fs.writeFile(file , jsonArtWorks , function (err){
            if(err){
              console.log(err);
            }
          });
        }
     })
    .catch(err => {
     console.log('error from update')
     throw err ;
    })
}

//reading data

function getArtworks(pageNumber){
    fetch(baseUrl+pageNumber)
      .then(response => {
        return response.json()
      })
      .then(data => {
          let artSize = data.payload.products.length;
          let nextPage = data.payload.pagination.next ;

          for (let i = 0 ; i < artSize  ; i++) {
          let artwork = {} ;
            artwork.id = data.payload.products[i]._id ;
            artwork.title = data.payload.products[i].title ;
            artwork.desc = data.payload.products[i].desc ;
            artwork.imgUrl = data.payload.products[i].mainImage ;
            artwork.artist = data.payload.products[i].createdBy.fullname ;
            artwork.cat = data.payload.products[i].category.label ;
            artworks.push(artwork);
          }
          console.log(`page is done`)
          if (artSize != 0 ){
            getArtworks(nextPage);
          }else{
            console.log(artworks.length);
            console.log(artworks);
            let jsonArtWorks = JSON.stringify(artworks);
            fs.writeFile(file , jsonArtWorks , function (err){
              if(err){
                console.log(err);
              }
            });
          }
       })
      .catch(err => {
       console.log('error from read')
      })
}

// running

function start(){
  try{
  artworks = JSON.parse(fs.readFileSync(file));
  if(artworks.length !== 0 ) {
    updateArtworks(1)
  }else {
    getArtworks(1);
  }
  }catch{
    getArtworks(1);
  }
}

start();
// var j = schedule.scheduleJob(rule, function(){
//   start();
// });
