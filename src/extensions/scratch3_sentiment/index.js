const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const RenderedTarget = require('../../sprites/rendered-target');
const formatMessage = require('format-message');

// sentiment
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
let localSentiment = 1;
let server_url = 'http://text-processing.com/api/sentiment/';
let feeling;
const iconURI = require('./assets/sentiment_icon');


class Scratch3Sentiment {
    constructor (runtime) {
        this.runtime = runtime;
  
    }

    getInfo () {
        return {
            id: 'sentiment',
            name: formatMessage({
                id: 'feelings.feelings',
                default: 'Feelings',
                description: ''
            }),
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'whenPositive',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'feelings.whenPositive',
                        default: 'When text is positive',
                        description: ''
                    }),
                },
                {
                    opcode: 'whenNegative',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'feelings.whenNegative',
                        default: 'When text is negative',
                        description: ''
                    }),
                },
                {
                    opcode: 'whenNeutral',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'feelings.whenNeutral',
                        default: 'When text is neutral',
                        description: ''
                    })                
                },
                {
                    opcode: 'getFeeling',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'feelings.getFeeling',
                        default: 'What is the feeling of the text',
                        description: ''
                    }) + ': [phrase]?',
                    arguments: {
                        phrase: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.yourTextHere',
                                default: 'your text here',
                                description: ''
                            }) 
                        }
                    }
                }
                
            ],
            menus: {
             	trueFalse: [
                    formatMessage({
                        id: 'general.true',
                        default: 'true',
                        description: ''
                    }),
                    formatMessage({
                        id: 'general.false',
                        default: 'false',
                        description: ''
                    })
                ]
            }
        };
    }

    getFeeling (args, util){
        const text = args.phrase;
        localSentiment = sentiment.analyze(text);
        // debugger;
        console.log(sentiment.analyze(text));
        if (localSentiment.score >= 2){
            feeling = 'positive';
        } else if (localSentiment.score < 0){
            feeling = 'negative';
        } else {
            feeling = 'neutral';
        }
        return feeling;
    }
  
    whenPositive (args, util) {
        if (feeling == 'positive'){
            return true;
        }
        return false;
    }
    
    whenNegative (args, util) {
        if (feeling == 'negative'){
            return true;
        }
        return false;         
    }

    whenNeutral (args, util) {
        if (feeling == 'neutral'){
            return true;
        }
        return false;
    }
}

module.exports = Scratch3Sentiment;