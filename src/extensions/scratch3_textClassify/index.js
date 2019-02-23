const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const iconURI = require('./assets/text_icon');


let base_url = 'https://cognimate.me:2635/nlc';

class Scratch3TextClassify {
    constructor (runtime) {
        this.runtime = runtime;

    }

    getInfo () {
        return {
            id: 'text_classify',
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
                        KEY:{
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
                        IDSTRING: {
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
                        IDSTRING: {
                            type: ArgumentType.STRING,
                            defaultValue: 'insert text'
                        }
                    }
                },
                {
                    opcode: 'classifyText',
                    blockType: BlockType.REPORTER,
                    text: 'What do you see in the photo?',
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
                },
                {
                    opcode: 'clearResults',
                    blockType: BlockType.COMMAND,
                    text: 'Clear results'
                }
            ],
            menus: {
                models: ['Default','RockPaperScissors'],
            }
        };
    }


    latestUserTweet(args, util) {
        var user = args.USER;
        if (this._lastUser === user &&
            this._lastResult !== null) {
            return this._lastResult;
        }
        this._lastUser = user;
        const _this = this;
        var uri = 'statuses/user_timeline.json';
        var params = {uri: uri, user: user};
        let promise = new Promise((resolve)=>{
        this.makeCall(params,
            function(err, response) {
            if (err){
                console.log(err);
                this._lastResult = '';
                resolve('');
            }
            else {
                console.log(response.body);
                output = JSON.parse(response.body);
                _this._lastResult = output;
                resolve(output);
            }});
        });
        promise.then(output => output);
        return promise
    }


    getTopTweet(args, util){
        if(classifyRequestState == REQUEST_STATE.FINISHED) {
            classifyRequestState = REQUEST_STATE.IDLE;
            return top_output;
          }
          if(classifyRequestState == REQUEST_STATE.PENDING) {
            util.yield()
          }
          if(classifyRequestState == REQUEST_STATE.IDLE) {
            var hashtag = encodeURIComponent(args.HASH);
            var uri = '/search/tweets';
            var category = args.CATEGORY;
            var params = {uri: uri, hashtag: hashtag, category: category};
            this.makeCall(params,
                function(err, response) {
                if (err){
                    console.log(err);
                }
                else {
                    console.log(response.body);
                    top_output = JSON.parse(response.body);
                    classifyRequestState = REQUEST_STATE.FINISHED;
                }});
            if(classifyRequestState == REQUEST_STATE.IDLE) {
                classifyRequestState = REQUEST_STATE.PENDING;
                util.yield();
            }
          }
        }

    makeCall(params, callback){
        var uri = params.uri;
        if(params.user){
            var user = params.user;
            var formData = JSON.stringify({ uri: uri, user: user});
            nets({
                url: server_url,
                headers: {
                  'Content-Type': 'application/json' // important header to be included henceforth
                }, // couldn't figure out how to get x-url-encoded content-type to work
                method: 'POST',
                body: formData,
                encoding: undefined // This is important to get response as a string otherwise it returns a buffer array
              }, function(err, response){
                    callback(err, response);
                });
        } else{
            var category = params.category;
            var hashtag = params.hashtag;
            var formData = JSON.stringify({ uri: uri, hashtag: hashtag, category: category});
            nets({
                url: server_url,
                headers: {
                  'Content-Type': 'application/json'
                },
                method: 'POST',
                body: formData,
                encoding: undefined
              }, function(err, response){
                    console.log(response);
                    callback(err, response);
                });
        }
    }

}

module.exports = Scratch3Classify;
