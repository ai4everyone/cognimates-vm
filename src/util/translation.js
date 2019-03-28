<<<<<<< HEAD
const formatMessage = require('format-message');
var trans = require('../../trans.json');

class Translations {
    constructor() {
        this.langs = trans;
    }

    static fromJSON(json) {
        var langs = Translations.reformat(json)
        Translations.langs = langs
    }
=======
class Translations {

    static csvJSON(csv){

      var lines=csv.split("\n");

      var result = [];

      var headers=lines[0].split(",");

      for(var i=1;i<lines.length;i++){

          var obj = {};
          var currentline=lines[i].split(",");

          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }

          result.push(obj);

      }

      //return result; //JavaScript object
      return JSON.stringify(result); //JSON
    } 

    static makeRequest (url, method) {

        // Create the XHR request
        var request = new XMLHttpRequest();

        // Return it as a Promise
        return new Promise(function (resolve, reject) {

            // Setup our listener to process compeleted requests
            request.onreadystatechange = function () {

                // Only run if the request is complete
                if (request.readyState !== 4) return;

                // Process the response
                if (request.status >= 200 && request.status < 300) {
                    // If successful
                    resolve(request);
                } else {
                    // If failed
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }

            };

            // Setup our HTTP request
            request.open('POST', url, true);

            // Send the request
            request.send();

        });
    };
>>>>>>> parent of bb737c6f... translation complete for sentiment extension

    static Get() {
        var trans;
        // nets({
        //     url:'https://sheetsu.com/apis/v1.0su/2749ada2e00e',
        //     method: 'GET'
        // }, function(err, response) {
        //     console.log(response)
        //     trans = JSON.parse(response.responseText)
        //     console.log(trans)
        // })
        url = 'https://sheetsu.com/apis/v1.0su/2749ada2e00e'
        var request = new XMLHttpRequest();
        request.open('GET', url, false)
        request.send()
        trans = JSON.parse(request.responseText)
        return trans
    }

<<<<<<< HEAD
    static reformat(arr) {
        var trans = {};
        for (row in arr) {
            console.log(arr[row]['Language'])
            trans[arr[row]['Language']] = arr[row];
        }
        console.log(trans)
        return trans;
    }

    getTrans(msg) {
        var locale = formatMessage.setup().locale;
        console.log(locale)
        if (locale === 'de') {
            return this.langs['German'][msg]
        }
        else {
            return msg
        }
=======
    static getTrans(lang) {
        var json_obj = Translations.Get()
        console.log(json_obj)
        console.log("this is the author name: "+ json_obj['Name:']);
>>>>>>> parent of bb737c6f... translation complete for sentiment extension
    }

}

module.exports = Translations;