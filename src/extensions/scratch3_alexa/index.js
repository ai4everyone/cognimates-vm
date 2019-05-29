const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const nets = require('nets');
const SocketIO = require('socket.io-client');
const formatMessage = require('format-message');


// const BASE_URL = 'http://35.169.45.24:6456';
// http://35.169.45.24:6456/attributes/alexa?attribute=color
const BASE_URL = 'https://cognimate.me:6456';

// const BASE_URL = 'https://eesh.me:6456';
// const BASE_URL = 'http://35.169.45.24:6456';
const LOGIN_URL = `${BASE_URL}/user/login`;
const REGISTER_URL = `${BASE_URL}/user/register`;
const ALEXA_ATTRIBUTES_URL = `${BASE_URL}/attributes/alexa`;
const USER_ATTRIBUTES_URL = `${BASE_URL}/attributes/user`;
const USER_MESSAGES_URL = `${BASE_URL}/messages/user`;

let USER_AUTH_TOKEN = null;
let USER_ACCESS_CODE = null;

let blockSet1Execute = false;
let blockSet2Execute = false;
let blockSet3Execute = false;

let socket = null;
const iconURI = require('./assets/alexa_icon');
class Scratch3Alexa {

    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'alexa',
            name: 'Alexa',
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'registerUser',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.createAccount',
                        default: 'Create account: Username [USERNAME]   Passphrase [PASSPHRASE]',
                        description: 'create alexa account'
                    }), 
                    arguments: {
                        USERNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        },
                        PASSPHRASE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'loginUser',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.accessAccount',
                        default: 'Access account: Username [USERNAME]   Passphrase [PASSPHRASE]',
                        description: 'access alexa account'
                    }), 
                    arguments: {
                        USERNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        },
                        PASSPHRASE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'addUserAttribute',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.tellAlexaMyFavorite',
                        default: 'Tell Alexa my favourite [ATTRIBUTE] is [VALUE]',
                        description: ''
                    }), 
                    arguments: {
                        ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                              id: 'alexa.band',
                              default: 'band',
                              description: ''
                          }) 
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Artic Monkeys'
                        }
                    }
                },
                {
                    opcode: 'addUserAttribute2',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.tellAlexaMyCurrent',
                        default: 'Tell Alexa my current [ATTRIBUTE] is [VALUE]',
                        description: ''
                    }),
                    arguments: {
                        ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                              id: 'alexa.age',
                              default: 'age',
                              description: ''
                          })
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '7'
                        }
                    }
                },
                {
                    opcode: 'addUserAttribute3',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.tellAlexaMy',
                        default: 'Tell Alexa my [ATTRIBUTE] is [VALUE]',
                        description: ''
                    }),
                    arguments: {
                        ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                              id: 'alexa.location',
                              default: 'location',
                              description: ''
                          })
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Boston'
                        }
                    }
                },
                {
                    opcode: 'addAlexaAttribute',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.tellAlexaItsFavorite',
                        default: 'Tell Alexa its favourite [ATTRIBUTE] is [VALUE]',
                        description: ''
                    }),
                    arguments: {
                        ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                              id: 'alexa.movie',
                              default: 'movie',
                              description: ''
                          })
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Bladerunner'
                        }
                    }
                },
                {
                    opcode: 'addUserMessage',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'alexa.messageAlexa',
                        default: 'Message Alexa: [MESSAGE]',
                        description: ''
                    }),
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'runBlockSet1',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'alexa.command',
                        default: 'Command',
                        description: ''
                    }) + ' 1',
                },
                {
                    opcode: 'runBlockSet2',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'alexa.command',
                        default: 'Command',
                        description: ''
                    }) + ' 2',
                },
                {
                    opcode: 'runBlockSet3',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'alexa.command',
                        default: 'Command',
                        description: ''
                    }) + ' 3',
                },
                {
                    opcode: 'getAccessCode',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'alexa.acessCode',
                        default: 'Get Access Code',
                        description: ''
                    })
                }
            ]
        };
    }

    loginUser (args, util) {
        const username = args.USERNAME;
        const passphrase = args.PASSPHRASE;
        const headers = {
            'Content-Type': 'application/json'
        };
        nets({
            url: LOGIN_URL,
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username: username, passphrase: passphrase}),
            encoding: undefined
            }, (err, httpResponse, body) => {
              if (err == null) {
                  const res = JSON.parse(body);
                  if (res.authToken != undefined) {
                      console.log(`loginUser: ${res.access_code}`);
                      USER_AUTH_TOKEN = res.authToken;
                      USER_ACCESS_CODE = res.access_code;
                      this.connectSever();
                  } else console.log('loginUser: Fail');
              } else {
                  console.log(`Error: ${err.message}`);
              }
            });
    }
    registerUser (args, util) {
        const username = args.USERNAME;
        const passphrase = args.PASSPHRASE;
        const headers = {
            'Content-Type': 'application/json'
        };
        nets({
            url: REGISTER_URL,
            method: 'POST',
            headers: headers,
            body: JSON.stringify({username: username, passphrase: passphrase}),
            encoding: undefined
            }, (err, httpResponse, body) => {
                if (err == null) {
                    const res = JSON.parse(body);
                    if (res.username != undefined) {
                        console.log('registerUser: Ok');
                    } else console.log('registerUser: Fail');
                } else {
                    console.log(`Error: ${err.message}`);
                }
            });
    }


    addUserAttribute (args, util) {
        const attribute = args.ATTRIBUTE;
        const value = args.VALUE;
        const headers = {
            'authtoken': USER_AUTH_TOKEN,
            'Content-Type': 'application/json'
        };
        nets({
              url:USER_ATTRIBUTES_URL,
              method: 'POST',
              headers: headers,
              body: JSON.stringify({attribute: attribute, value: value}),
              encoding: undefined
             }, (err, httpResponse, body) => {
                if (err == null) {
                    const res = JSON.parse(body);
                    if (res.value != null) {
                        console.log('addUserAttribute: Ok');
                    } else console.console.log('addUserAttribute: Fail');
                } else {
                    console.log(`Error: ${err.message}`);
                }
             });
    }

    addUserAttribute2 (args, util) {
        const attribute = args.ATTRIBUTE;
        const value = args.VALUE;
        const headers = {
            'authtoken': USER_AUTH_TOKEN,
            'Content-Type': 'application/json'
        };
        nets({
              url: USER_ATTRIBUTES_URL,
              method: 'POST',
              headers: headers,
              body: JSON.stringify({attribute: attribute, value: value}),
              encoding: undefined
             }, (err, httpResponse, body) => {
              if (err == null) {
                  const res = JSON.parse(body);
                  if (res.value != null) {
                      console.log('addUserAttribute: Ok');
                  } else console.console.log('addUserAttribute: Fail');
              } else {
                  console.log(`Error: ${err.message}`);
              }
           });
    }

    addUserAttribute3 (args, util) {
        const attribute = args.ATTRIBUTE;
        const value = args.VALUE;
        const headers = {
            'authtoken': USER_AUTH_TOKEN,
            'Content-Type': 'application/json'
        };
        nets({
              url: USER_ATTRIBUTES_URL,
              method: 'POST',
              headers: headers,
              form: JSON.stringify({attribute: attribute, value: value}),
              encoding: undefined
            }, (err, httpResponse, body) => {
              if (err == null) {
                  const res = JSON.parse(body);
                  if (res.value != null) {
                      console.log('addUserAttribute: Ok');
                  } else console.console.log('addUserAttribute: Fail');
              } else {
                  console.log(`Error: ${err.message}`);
              }
           });
    }


    addUserMessage (args, util) {
        const message = args.MESSAGE;
        const value = args.VALUE;
        const headers = {
            'authtoken': USER_AUTH_TOKEN,
            'Content-Type': 'application/json'
        };
        nets({
              url: USER_MESSAGES_URL,
              method: 'POST',
              headers: headers,
              body: JSON.stringify({message: message}),
              encoding: undefined
            }, (err, httpResponse, body) => {
              if (err == null) {
                  const res = JSON.parse(body);
                  if (res.value != null) {
                      console.log('addUserMessage: Ok');
                  } else console.console.log('addUserMessage: Fail');
              } else {
                  console.log(`Error: ${err.message}`);
              }
           });
    }
    addAlexaAttribute (args, util) {
        const attribute = args.ATTRIBUTE;
        const value = args.VALUE;
        console.log(`Adding alexa attribute ${attribute} with value ${value}`);
        const headers = {
            'Content-Type': 'application/json'
        };
        nets({
              url: ALEXA_ATTRIBUTES_URL,
              method: 'POST',
              headers: headers,
              body: JSON.stringify({attribute: attribute, value: value}),
              encoding: undefined
            }, (err, httpResponse, body) => {
              if (err == null) {
                  const res = JSON.parse(body);
                  if (res.value != null) {
                      console.log('addAlexaAttribute: Ok');
                  } else console.console.log('addUserAttribute: Fail');
              } else {
                  console.log(`Error: ${err.message}`);
              }
           });
    }

    /**
      * Run blocks in the hat block
      needs renaming
    */
    runBlockSet1 () {
        if (blockSet1Execute) {
            blockSet1Execute = false;
            return true;
        }
        return false;
    }

    /**
      * Run blocks in the hat block
    */
    runBlockSet2 () {
        if (blockSet2Execute) {
            blockSet2Execute = false;
            return true;
        }
        return false;
    }

    /**
      * Run blocks in the hat block
    */
    runBlockSet3 () {
        if (blockSet3Execute) {
            blockSet3Execute = false;
            return true;
        }
        return false;
    }

    getAccessCode () {
        return USER_ACCESS_CODE;
    }

    connectSever () {
        socket = SocketIO(BASE_URL);
        socket.on('connect', () => {
            socket.send({command: 'register', access_code: USER_ACCESS_CODE});
            console.log('Connected');
        });

        socket.on('message', message => {
            console.log(message);
            if (message.error != null) {
                console.log(message.error);
                return;
            }
            if (message.command == 'runcommand') {
                if (message.arguments.set == 1) {
                    blockSet1Execute = true;
                }
                if (message.arguments.set == 2) {
                    blockSet2Execute = true;
                }
                if (message.arguments.set == 3) {
                    blockSet3Execute = true;
                }
            }
        });
    }
}

module.exports = Scratch3Alexa;
