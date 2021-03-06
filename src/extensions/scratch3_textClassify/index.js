const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const iconURI = require('./assets/text_icon');
const formatMessage = require('format-message');

// let base_url = 'https://cognimate.me:2636/nlc';
let base_url = 'https://cognimate.me:2635/nlc';
let read_api; 
let write_api;
let username; 
let classifier_name; //name of classifier to use
let class_name; //name of class that goes w/ the classifier
let results; //stores all results and probability
let label; //result with the highest probability

class Scratch3TextClassify {
    constructor (runtime) {
        this.runtime = runtime;

    }

    getInfo () {
        return {
            id: 'text',
            name: formatMessage({
                id: 'text.textTraining',
                default: 'Text Training',
                description: ''
            }), 
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'setReadAPI',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'text.setReadAPI',
                        default: 'Set Read API key to',
                        description: ''
                    }) + ' [KEY]',
                    arguments:{
                        KEY:{
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.key',
                                default: 'key',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'setWriteAPI',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'text.setWriteAPI',
                        default: 'Set Write API key to',
                        description: ''
                    }) + ' [KEY]',
                    arguments:{
                        KEY:{
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.key',
                                default: 'key',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'setUsername',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'text.setUsername',
                        default: 'Set username to',
                        description: ''
                    }) + ' [USER]',
                    arguments:{
                        USER:{
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'getClassifier',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'text.getClassifier',
                        default: 'Choose text model',
                        description: ''
                    }) + ': [IDSTRING]',
                    arguments: {
                        IDSTRING: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'text.modelName',
                                default: 'model name',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'getClass',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'text.setCategory',
                        default: 'Set category to train',
                        description: ''
                    }) + ': [CLASS]',
                    arguments: {
                        CLASS: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'text.categoryName',
                                default: 'category name',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'trainText',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'text.trainText',
                        default: 'Send texts [TEXT] to train',
                        description: ''
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.insertText',
                                default: 'insert text',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'classifyText',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'text.classifyText',
                        default: 'What kind of phrase is [TEXT]?',
                        description: ''
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'text.phrase',
                                default: 'phrase',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'getScore',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'text.getScore',
                        default: 'How sure are you the text is a [CLASS]?',
                        description: ''
                    }),
                    arguments:{
                        CLASS: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.addCategory',
                                default: 'add category here',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'textHat',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'text.whenText',
                        default: 'When text is a [CLASS]?',
                        description: ''
                    }),
                    arguments:{
                        CLASS: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.addCategory',
                                default: 'add category here',
                                description: ''
                            })
                        }
                    }
                }
            ],
            menus: {
                models: ['Default','RockPaperScissors'],
            }
        };
    }

    setReadAPI(args, util){
        read_api = args.KEY;
    }

    setWriteAPI(args, util){
        write_api = args.KEY;
    }

    setUsername(args, util){
        username = args.USER;
    }

    getClassifier(args, util){
        classifier_name = args.IDSTRING;
    }

    getClass(args, util){
        class_name = args.CLASS;
    }

    classifyText(args, util, callback){
        //make sure everything necessary has been set
        if(read_api == null){
            return 'Set a Read API Key';
        } else if (username == null){
            return 'No username was set';
        } else if(classifier_name == null){
            return 'No classifier name was set';
        }

        let phrase = args.TEXT;

        if (this._lastPhrase === phrase &&
            this._lastResult !== null) {
            return this._lastResult;
        }

        this._lastPhrase = phrase;
        const _this = this;
        let promise = new Promise((resolve)=>{
        this.makeClassifyCall(phrase,
            function(err, response) {
            if (err){
                console.log(err);
            }
            else {
                console.log(response);
                resp_result = JSON.parse(response.body, null, 2);
                results = {};
                //store everything
                for (var i = 0, length = resp_result.length; i < length; i++) {
                    results[resp_result[i].className.toLowerCase()] = resp_result[i].p;
                }
                //figure out the highest scoring class
                var class_label;
                var best_score = 0;
                for (var key in results) {
                    if (results.hasOwnProperty(key)) {
                        if(results[key]>best_score){
                            best_score = results[key];
                            class_label = key;
                        }
                    }
                }
                console.log(results);
                label = class_label;
                _this._lastResult = label;
                resolve(label);
            }});
        });
        promise.then(output => output);

        return promise;
    }

    makeClassifyCall(phrase, callback){
        var formData = JSON.stringify({ 
            classifier_id: classifier_name,
            classify_username: username,
            phrase: phrase,
            token: read_api
        });

        nets({
            url: base_url + "/classify/",
            headers: {
              'Content-Type': 'application/json' // important header to be included henceforth
            }, // couldn't figure out how to get x-url-encoded content-type to work
            method: 'POST',
            body: formData,
            encoding: undefined // This is important to get response as a string otherwise it returns a buffer array
          }, function(err, response){
                callback(err, response);
        });
    }

    trainText(args, util){
         //make sure everything necessary has been set
         if(write_api == null){
            return 'Set a Write API Key';
        } else if (class_name == null){
            return 'No class name was set';
        } else if(classifier_name == null){
            return 'No classifier name was set';
        }

        let phrase = args.TEXT;

        if (this._lastTrainPhrase === phrase &&
            this._lastTrainResult !== null) {
            return this._lastTrainResult;
        }

        this._lastTrainPhrase = phrase;
        const _this = this;
        let promise = new Promise((resolve)=>{
        this.makeTrainingCall(phrase,
            function(err, response) {
            if (err){
                console.log(err);
            }
            else {
                result = 'Text Data Sent';
                _this._lastTrainResult = result;
                resolve(result);
            }});
        });
        promise.then(output => output);

        return promise;
    }

    makeTrainingCall(phrase, callback){
        var formData = JSON.stringify({ 
            classifier_name: classifier_name,
            class_name: class_name,
            texts: [phrase],
            write_token: write_api
        });

        nets({
            url: base_url + "/addExamples",
            headers: {
              'Content-Type': 'application/json' // important header to be included henceforth
            }, // couldn't figure out how to get x-url-encoded content-type to work
            method: 'POST',
            body: formData,
            encoding: undefined // This is important to get response as a string otherwise it returns a buffer array
          }, function(err, response){
                callback(err, response);
        });

    }

    getScore(args, util){
        //check that classes is not empty
        if(results === null){
            return 'did you classify any text yet?'
        }
        var comparison_class = args.CLASS.toLowerCase();
        console.log(results);
        //make sure the class entered is valid
        if(!results.hasOwnProperty(comparison_class)){
            return 'this is not a valid class'
        }
        return results[comparison_class];
    }

    textHat(args, util){
        let category = args.CLASS;
        if(label == category){
            return true;
        } else{
            return false;
        }
    }


}

module.exports = Scratch3TextClassify;
