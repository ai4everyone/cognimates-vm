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
let response;
let connected;

/*
0 = sending analog output
1 = sending digital output
*/
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
                    opcode: 'whenConnected',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'arduino.checkConnect',
                        default: 'When Arduino is Connected',
                        description: ''
                    })
                },
                {
                    opcode: 'analogOutput',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id:'arduino.analogOutput',
                        default: 'Set pin [PIN] to [VALUE]%',
                        description: ''
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'pin number'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'digitalOutput',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'arduino.digitalOutput',
                        default: 'Set pin [PIN] to [VALUE]'
                    }),
                    arguments:{
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'pin number'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'on',
                            menu: 'onOff'
                        }
                    }
                },
                {
                    opcode: 'analogRead',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'arduino.analogRead',
                        default: 'read analog pin [PIN]'
                    }),
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'pin number'
                        }
                    }
                }
            ],
            menus: {
             	onOff: ['on', 'off']
            }
        };
    }

    whenConnected(){
        return this.connected;
    }

    connect(){
        this.port.connect().then(() => {
            this.port.onReceive = data => {
              let textDecoder = new TextDecoder();
              console.log(textDecoder.decode(data));
              this.connected = true; 
            }
            this.port.onReceiveError = error => {
              console.log('Receive error: ' + error);
              this.connected = false;
            };
          }, error => {
            console.log('Connection error: ' + error);
            this.connected = false;
        });
    }

    arduinoConnect(args, util){
        if (this.port) {
            this.port.disconnect().then(
                serial.requestPort().then(selectedPort => {
                    this.port = selectedPort;
                    this.connect();
                    }).catch(error => {
                    console.log('Connection error: ' + error);
                })
            );
        } else {
            serial.requestPort().then(selectedPort => {
                this.port = selectedPort;
                this.connect();
                }).catch(error => {
                console.log('Connection error: ' + error);
            });
        }
    }

    analogOutput(args, util){
        if (!this.port) {
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
        console.log(view);
        this.port.send(view);
    }

    digitalOutput(args, util){
        let view = new Uint8Array(3);
        if(args.VALUE == 'on'){
            view[0] = 1;
            view[1] = parseInt(args.PIN);
            view[2] = 1;
        } else {
            view[0] = 1;
            view[1] = parseInt(args.PIN);
            view[2] = 0;
        }
        console.log(view);
        this.port.send(view);
    }

    analogRead(args, util){
        let view = new Uint8Array(3);
        view[0] = 2;
        view[1] = parseInt(args.PIN);
        view[2] = 0;
        console.log(view);
        let readLoop = () => {
            this.port.device_.transferIn(this.port.endpointIn_, 64).then(result => {
              this.port.onReceive(result.data);
              readLoop();
            }, error => {
              this.port.onReceiveError(error);
            });
        };
        this.port.send(view).then(
            this.port.device_.transferIn(this.port.endpointIn_, 64).then(
                result => {
                    if(result.status !== '200'){
                        return;
                    }
                }
            )
        ).then(()=>{
            this.port.device_.transferIn(this.port.endpointIn_, 64).then(
                result => {
                    console.log(result);
                    let textDecoder = new TextDecoder();
                    this.response = textDecoder.decode(result.data);
                    console.log(this.response);
                }
            )
        });
        console.log(this.response);
        return this.response;
    }  
}

module.exports = Scratch3Arduino;