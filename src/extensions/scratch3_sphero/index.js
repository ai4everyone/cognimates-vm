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
const { Scanner, Utils } = require('spherov2.js');

const iconURI = require('./assets/sphero_icon');


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
                },
                // makeItRoll();
                {
                    opcode: 'makeItRoll',
                    blockType: BlockType.COMMAND,
                    text: 'connect'
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
        console.log("number steps is:");

    }

    setLed (args,util){

    }
    getSpeed (args,util){

    }
    playSound (args,util){

    }
    makeItRoll(args,util){
        const sphero = Scanner.findSpheroMini();
        
        if (!sphero) return console.log('sphero mini not available!');
        
        const speed = 100;
        const headingInDegrees = 0;
        const timeToRollInMilliseconds = 2000;
        const flags = [];
        
        sphero.rollTime(speed, headingInDegrees, timeToRollInMilliseconds, flags);
    };
}

module.exports = Scratch3Sphero;




