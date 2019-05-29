const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const RenderedTarget = require('../../sprites/rendered-target');
const formatMessage = require('format-message');

const iconURI = require('./assets/arduino_icon');
var serial = require('./serial');
var port;

class Scratch3Arduino {
    constructor (runtime) {
        this.runtime = runtime;
  
    }

    getInfo () {
        return {
            id: 'arduino',
            name: formatMessage({
                id: 'arduino.arduino',
                default: 'Arduino',
                description: ''
            }),
            blockIconURI: iconURI,
            colour: '#42cef4',
            colourSecondary: '#43b8d8',
            colourTertiary: '#43b8d8',
            blocks: [
                {
                    opcode: 'arduinoConnect',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduino.arduinoConnect',
                        default: 'Connect to Arduino',
                        description: ''
                    }),
                },
                {
                    opcode: 'analogOutput',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id:'arduino.analogOutput',
                        default: 'Set [PIN] to [VALUE]%',
                        description: ''
                    })
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

    connect(){
        port.connect().then(() => {
            console.log(port);
            port.onReceive = data => {
              let textDecoder = new TextDecoder();
              console.log(textDecoder.decode(data));
            }
            port.onReceiveError = error => {
              console.log('Receive error: ' + error);
            };
          }, error => {
            console.log('Connection error: ' + error);
        });
    }

    arduinoConnect(args, util){
        if (port) {
            port.disconnect();
            connectButton.textContent = 'Connect';
            port = null;
            } else {
                serial.requestPort().then(selectedPort => {
                port = selectedPort;
                connect();
                }).catch(error => {
                console.log('Connection error: ' + error);
            });
        }
    }

    analogOutput(args, util){
        if (!port) {
            return;
          }
        let pin = args.PIN;
        let value = args.VALUE;
        if(value<0){
            value = 0;
        } else if(value > 100){
            value = 100;
        }
    
        let view = new Uint8Array(3);
        view[0] = 0;
        view[1] = parseInt(pin);
        view[2] = parseInt(value);
        port.send(view);
    }


  
}

module.exports = Scratch3Arduino;