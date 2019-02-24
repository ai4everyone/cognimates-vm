const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const iconURI = require('./assets/text_icon');

let base_url = 'https://cognimate.me:2636/nlc';
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
            name: 'Text',
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'setReadAPI',
                    blockType: BlockType.COMMAND,
                    text: 'Set Read API key to [KEY]',
                    arguments:{
                        KEY:{
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    }
                },
                {
                    opcode: 'setWriteAPI',
                    blockType: BlockType.COMMAND,
                    text: 'Set Write API key to [KEY]',
                    arguments:{
                        KEY:{
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    }
                },
                {
                    opcode: 'setUsername',
                    blockType: BlockType.COMMAND,
                    text: 'Set username to [USER]',
                    arguments:{
                        USER:{
                            type: ArgumentType.STRING,
                            defaultValue: 'user'
                        }
                    }
                },
                {
                    opcode: 'getClassifier',
                    blockType: BlockType.COMMAND,
                    text: 'Choose text classifier using name: [IDSTRING]',
                    arguments: {
                        IDSTRING: {
                            type: ArgumentType.STRING,
                            defaultValue: 'classifier name'
                        }
                    }
                },
                {
                    opcode: 'getClass',
                    blockType: BlockType.COMMAND,
                    text: 'Set class to train: [CLASS]',
                    arguments: {
                        CLASS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'class name'
                        }
                    }
                },
                {
                    opcode: 'trainText',
                    blockType: BlockType.COMMAND,
                    text: 'Send texts [TEXT] to train',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'insert text'
                        }
                    }
                },
                {
                    opcode: 'classifyText',
                    blockType: BlockType.REPORTER,
                    text: 'What kind of [TEXT] is this?',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'phrase'
                        }
                    }
                },
                {
                    opcode: 'getScore',
                    blockType: BlockType.REPORTER,
                    text: 'How sure are you the text is a [CLASS]?',
                    arguments:{
                        CLASS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'add category here'
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

        this.makeClassifyCall(args.TEXT, 
            function(err, response){
                if(err){
                    console.log(err);
                } else {
                    parsed_response = JSON.parse(response.body, null, 2);
                    console.log(parsed_response);
                }
            }
        )

        return parsed_response;
    }

    makeClassifyCall(phrase, callback){
        nets({
            url: base_url + "/nlc/classify",
            headers: {
              'Content-Type': 'application/json' // important header to be included henceforth
            }, // couldn't figure out how to get x-url-encoded content-type to work
            method: 'POST',
            body: { 
                classifier_id: classifier_name,
                classify_username: username,
                phrase: phrase,
                token: read_api
            },
            encoding: undefined // This is important to get response as a string otherwise it returns a buffer array
          }, function(err, response){
                callback(err, response);
        });
    }

    trainText(args, util){
        return;
    }

    getScore(args, util){
        return;
    }


}

module.exports = Scratch3TextClassify;
