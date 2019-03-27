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
    }

}

module.exports = Translations;