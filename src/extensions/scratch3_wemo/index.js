const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const formatMessage = require('format-message');

//wemo extension
const iconURI = require('./assets/wemo_icon');
let wemoURL='http://localhost:3000/';

class Scratch3Wemo {
    constructor (runtime) {
        this.runtime = runtime;

    }

    getInfo () {
        return {
            id: 'wemo',
            name: 'Wemo',
            blockIconURI: iconURI,
            colour: '#ff9900',
            colourSecondary: '#e68a00',
            colourTertiary: '#e68a00',
            blocks: [
                {
                    opcode: 'turnOn',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'wemo.turnOn',
                        default: 'Turn [TOGGLE]',
                        description: ''
                    }),
                    arguments: {
                        TOGGLE: {
                            type: ArgumentType.STRING,
                            menu: 'toggle',
                            defaultValue: 'on'
                        }
                    }
                },
            ],
            menus: {
                toggle: [
                    formatMessage({
                        id: 'general.on',
                        default: 'on',
                        description: ''
                    }),
                    formatMessage({
                        id: 'general.off',
                        default: 'off',
                        description: ''
                    })
                ]
            }
        };
    }

    turnOn (args, util){
        if(args.TOGGLE === 'on'){
            nets({url: wemoURL +'on', function(err, response){
                if (err){
                    console.log(err);
                }
                else {
                    console.log('on')
                }
            }});
        } else{
            nets({url: wemoURL +'off', function(err, response){
                if (err){
                    console.log(err);
                }
                else {
                    console.log('off')
                }
            }});
        }   
    }   

}

module.exports = Scratch3Wemo;