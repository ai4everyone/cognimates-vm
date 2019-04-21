const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const RenderedTarget = require('../../sprites/rendered-target');

// sentiment
// var Sphero = require('sphero2.js');
// var orb = new Sphero();

const iconURI = require('./assets/sentiment_icon');


class Scratch3Sphero {
    constructor (runtime) {
        this.runtime = runtime;
  
    }

    getInfo () {
        return {
            id: 'sphero',
            name: 'Sphero',
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'move',
                    blockType: BlockType.COMMAND,
                    text: 'Move [NUMBER] steps'
                },
                {
                    opcode: 'setLed',
                    blockType: BlockType.COMMAND,
                    text: 'Set led color to [COLOR]'
                },
                {
                    opcode: 'getSpeed',
                    blockType: BlockType.REPORTER,
                    text: 'What is the speed?'
                },
                {
                    opcode: 'playSound',
                    blockType: BlockType.COMMAND,
                    text: 'Play sound [SOUND]',
                    // arguments: {
                    //     phrase: {
                    //         type: ArgumentType.STRING,
                    //         defaultValue: 'your text here'
                    //     }
                    // }
                }
                
            ],
            menus: {
             	trueFalse: ['true', 'false']
            }
        };
    }

    move (args, util){
        const steps = args.NUMBER;
        // debugger;
        console.log("number steps is:"args.NUMBER);

    }

    setLed (args,util){

    }
    getSpeed (args,util){

    }
    playSound (args,util){

    }
}

module.exports = Scratch3Sphero;