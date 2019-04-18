const formatMessage = require('format-message');

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
    }
    return new_dict;
}

reformat = function(arr) {
    var trans = {};
    for (row in arr) {
        var lang = language_codes[arr[row]['Language'].trim()]
        console.log(arr[row]['Language'])
        trans[lang] = toLower(arr[row]);
    }
    console.log(trans)
    return trans;
}

Get = function() {
    url = 'https://sheetsu.com/apis/v1.0su/2749ada2e00e'
    var request = new XMLHttpRequest();
    request.open('GET', url, false)
    request.send()
    var trans = JSON.parse(request.responseText)
    return trans
}

const allTrans = reformat(Get())

const Translations = function(msg) {
    var key_msg = msg.toLowerCase();
    var locale = formatMessage.setup().locale;
    if (locale in allTrans) {
        return allTrans[locale][key_msg]
    }
    else {
        return msg
    }

}

module.exports = Translations;