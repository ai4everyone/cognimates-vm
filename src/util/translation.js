<<<<<<< HEAD
const formatMessage = require('format-message');

<<<<<<< HEAD
const language_codes = {
    //'German': 'de',
    'Spanish': 'es',
    'French': 'fr'
}

// class Translations {
//     constructor() {
//         this.langs = {};
//     }

//     setup() {
//         var langs = Translations.reformat(Translations.Get());
//         Translations.langs = langs
//     }

//     static Get() {
//         url = 'https://sheetsu.com/apis/v1.0su/2749ada2e00e'
//         var request = new XMLHttpRequest();
//         request.open('GET', url, false)
//         request.send()
//         var trans = JSON.parse(request.responseText)
//         return trans
//     }

//     static reformat(arr) {
//         var trans = {};
//         for (row in arr) {
//             trans[arr[row]['Language']] = arr[row];
//         }
//         console.log(trans)
//         return trans;
//     }

//     getTrans(msg) {
//         var locale = formatMessage.setup().locale;
//         if (locale === 'de') {
//             return Translations.langs['German']["What is the feeling of the text"]
//         }
//         else {
//             return "What is the feeling of the text"
//         }
//     }

toLower = function(dict) {
    var new_dict = {};
    for (var key in dict) {
        new_dict[key.toLowerCase()] = dict[key];
=======
class Translations {
    constructor() {
        this.langs = {};
<<<<<<< HEAD
>>>>>>> parent of 2781b696... start integrating translations into extensions
    }

<<<<<<< HEAD
reformat = function(arr) {
    var trans = {};
    for (row in arr) {
        var lang = language_codes[arr[row]['Language'].trim()]
        console.log(arr[row]['Language'])
        trans[lang] = toLower(arr[row]);
=======
=======
    }

>>>>>>> parent of ad07412a... get translations to load from a local file
    setup() {
        var langs = Translations.reformat(Translations.Get());
        Translations.langs = langs
>>>>>>> parent of 2781b696... start integrating translations into extensions
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
        url = 'https://sheetsu.com/apis/v1.0su/2749ada2e00e'
        var request = new XMLHttpRequest();
        request.open('GET', url, false)
        request.send()
        var trans = JSON.parse(request.responseText)
        return trans
    }

    static getTrans(lang) {
        var json_obj = Translations.Get()
        console.log(json_obj)
        console.log("this is the author name: "+ json_obj['Name:']);
    }

}

module.exports = Translations;