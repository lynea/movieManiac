var express = require('express');
var router = express.Router();
var axios = require("axios"); 
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({
  extended: true
})); 

router.use(bodyParser.json());

/* GET users listing. */
router.post('/', function(req, res, next) {
  let showTitle = req.body.queryResult.parameters.shows; 
  let url = "http://www.omdbapi.com/?t="+showTitle+"&apikey=752fa0bf";
  let action = req.body.queryResult.action; 

  
    axios.get(url).then(aRes => {
      let apiData = aRes.data;  
      let actors =  apiData.Actors; 
      let writers = apiData.Writer;
      let title =   apiData.Title; 
      let image =   apiData.Poster; 
      let score =   apiData.imdbRating; 
      let plot =    apiData.Plot;
      let link =    "https://www.imdb.com/title/"+apiData.imdbID; 
      let textResponse = ""; 
      let standardText = " what else can i do for you?"; 

      if( action == "actors"){
         textResponse = "The main actors of "+ title + " are: " + actors; 
      }else if(action == "writers"){
        textResponse = "The writers of "+ title + " are: " + writers ; 
      } else if(action == "score"){
        textResponse = "IMDB users gave "+ title + " a score of: " + score ; 
      }else if(action == "plot"){
        textResponse = plot; 
      }else {
      console.log("i could not find what you are looking for.")
    }
      res.send(createTextResponse(textResponse, title, image, link, score, plot, standardText)); 
    }).catch(err =>{
      console.log(err); 
    })
});



function createTextResponse (textResponse, title, image, link){
  let response = {
    "fulfillmentText":title,
    "fulfillmentMessages": [
      {
        "card": {
          "title": title + ":",
          "subtitle": textResponse,
          "imageUri": image,
          "buttons": [
            {
              "text": "Se more",
              "postback": link
            }
          ]
        }
      }
    ],
   
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": textResponse
              }
            }
          ]
        }
      },
      "facebook": {
        "text": "Hello, Facebook!"
      },
      "slack": {
        "text": "This is a text response for Slack."
      }
    },
  
  };
return response; 
}

module.exports = router;


