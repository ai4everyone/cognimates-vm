const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const RenderedTarget = require('../../sprites/rendered-target');

// sentiment
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
let localSentiment = 1;
let server_url = 'http://text-processing.com/api/sentiment/';
let feeling;
const iconURI = require('./assets/speech_icon');

const SPEECH_STATES = {
    IDLE: 0,
    PENDING: 1,
    FINISHED: 2
};


class Scratch3Speech {
    constructor (runtime) {
        this.runtime = runtime;
        this.SpeechRecognition = window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition;

        this.AudioContext = window.AudioContext || 
                            window.webkitAudioContext;

        this._setupMicrophone();

        /**
         * A flag to indicate that speech recognition is paused during a speech synthesis utterance
         * to avoid feedback. This is used to avoid stopping and re-starting the speech recognition
         * engine.
         * @type {Boolean}
         */
        this.speechRecognitionPaused = false;

        /**
         * The most recent result from the speech recognizer, used for a reporter block.
         * @type {String}
         */
        this.latest_speech = '';

        /**
         * The name of the selected voice for speech synthesis.
         * @type {String}
         */
        this.current_voice_name = 'default';

        /**
         * The current speech synthesis utterance object.
         * Storing the utterance prevents a bug in which garbage collection causes the onend event to fail.
         * @type {String}
         */
        this.current_utterance = null;

        this.runtime.HACK_SpeechBlocks = this;
  
    }

    getInfo () {
        return {
            id: 'speech',
            name: 'Speech to Text',
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'startSpeechRecognition',
                    blockType: BlockType.COMMAND,
                    text: 'Start listening'
                },
                {
                    opcode: 'stopSpeechRecognition',
                    blockType: BlockType.COMMAND,
                    text: 'Stop listening'
                },
                {
                    opcode: 'whenIHear',
                    blockType: BlockType.HAT,
                    text: 'When I hear[TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        }
                    }
                },
                 {
                    opcode: 'getLatestSpeech',
                    blockType: BlockType.REPORTER,
                    text: 'Get latest speech'
                }
                
            ],
            menus: {
                trueFalse: ['true', 'false']
            }
        };
    }

    _setupMicrophone(){
        var audioCtx = new this.AudioContext();
        navigator.getUserMedia({
            audio: true,
        }, (stream) => {
            var source = audioCtx.createMediaStreamSource(stream);
            console.log('Microphone on');
        }, (err) => {
            console.error(err);
        });
    }

    getHats() {
        return {
            speech_whenihear: {
                restartExistingThreads: false,
                edgeActivated: true
            }
        };
    };

    startSpeechRecognition(args, util) {
        this.recognition = new this.SpeechRecognition();
        this.recognition.interimResults = true;
        this.continuous = true;
        this.recognized_speech = [];

        this.recognition.onresult = function(event) {
            if (this.speechRecognitionPaused) {
                return;
            }

            const SpeechRecognitionResult = event.results[event.resultIndex];
            const results = [];

            for (let k=0; k<SpeechRecognitionResult.length; k++) {
                results[k] = SpeechRecognitionResult[k].transcript.toLowerCase();
            }
            this.recognized_speech = results;
            this.latest_speech = this.recognized_speech[0];
            console.log(this.latest_speech);
            recognition_state = SPEECH_STATES.FINISHED;
        }.bind(this);

        this.recognition.onend = function() {
            if (this.speechRecognitionPaused) {
                return;
            }
            console.log('speech ended');
            this.recognition.start();
        }.bind(this);

        this.recognition.onstart = function () {
            this.recognition_state = SPEECH_STATES.LISTENING;
            console.log('speech recognition started');
        };

        this.recognition.onerror = function(event) {
            console.log('speech recognition error', event.error);
            console.log('additional information: ' + event.message);
        };

        this.recognition.onnomatch = function() {
            console.log('Speech recognition: no match');
        }

        try {
            this.recognition.start();
        }
        catch(e) {
            console.error(e);
        }
    };

    stopSpeechRecognition(args, util) {
        this.recognition.onend = function() {
            console.log('speech recognition ended');
        };
        try {
            this.recognition.stop();
        } catch(e) {
            console.error(e);
        }
    };

    whenIHear(args, util) {
        if (!this.recognition) {
            return;
        }

        let input = Cast.toString(args.TEXT).toLowerCase();
        input = input.replace(/[.?!]/g, '');
        input = input.trim();

        if (input === '') return false;
        return this.recognized_speech[0].includes(input);
    };

    getLatestSpeech(args, util) {
        console.log('latest speech: ', this.latest_speech);
        return this.latest_speech;
    };
}

module.exports = Scratch3Speech;