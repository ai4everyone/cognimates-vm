console.log("mission commander loaded!");

//Mission
var mission = mission1;
var mission_initialized = false;
var stepIdx = 0;
var STATE = 0;
var notComplain = true
let metadata;
let actualImage;
// get metadata of the server
 $.ajax({
		type: 'GET',
		dataType: 'text',
		url: './metadata',
		success: (e) => {
				console.log(e);
				metadata = JSON.parse(e);
		},
		error: (error) => {
				console.log("error ");
				console.log(error);
		}
});

function reinitComplain(){
	notComplain = true
}

function missionCommander(wblocks) {
	console.log("blocks: ",wblocks);
	workspace.getBlockById('event_whenflagclicked');

	auxblocks = [];
	for (var i = 0; i < wblocks.length; i++) {
		auxblocks.push(wblocks[i]['opcode']);
	}
	if (stepIdx < mission.steps.length){ //if ((window.robot) && (stepIdx < mission.steps.length)){
		if (!mission_initialized){
			populateMedia();
		}

		mission_initialized = true;
		step = mission.steps[stepIdx];
		console.log(auxblocks)
		if (STATE == 0){
			console.log("state is equal to 0")
			if (JSON.stringify(auxblocks) === JSON.stringify(step.init_blocks)) {
				tutorSay(step.init.text);
				/*jiboSay(step.init.text).then(()=>{
					console.log('say promise resolved');
					jiboShowImage(step.init.image);
					setTimeout(()=>{
							jiboHideImage();
					},1000); 
				});*/

				STATE = 1;
			}
		} else if ((STATE == 1) ){
			console.log("state is equal to 1")
			if (JSON.stringify(auxblocks) === JSON.stringify(step.end_blocks)) {
				tutorSay(step.ok.text);
				/*jiboSay(step.ok.text).then(()=>{
					missionCommander(wblocks);
				});*/
				STATE = 0;
				stepIdx = stepIdx + 1;
			} else{
				if (JSON.stringify(auxblocks) !== "[]"){
					if (notComplain){
						tutorSay(step.bad_block.text);
						/*jiboSay(step.bad_block.text).then(()=>{
							notComplain = false;
							setTimeout(reinitComplain,30000);
						});*/

					}


				}
			}
		}
    }

}

//Scratch Tutor Functions

function tutorSay(tts) {
	responsiveVoice.speak(tts);
}

function tutorAnimate(block) {
	animateBlock(block, 100, 100, 5);
}

//Animation Help Functions


function linearInterpolate(percent) {
  return percent;
}


function animateBlock(block, dx, dy, seconds, optionalInterpolateFn) {
  let interpolate = optionalInterpolateFn || linearInterpolate;
  let dt = seconds * 1000; // Convert to milliseconds.
  let start = Date.now();
  var movedX = 0, movedY = 0; 

  let step = function() {
    let now = Date.now();
    let percent = (now - start) / dt;
    if (percent < 1.0) {
      let stepX = interpolate(percent) * dx - movedX;
      let stepY = interpolate(percent) * dy - movedY;
      block.moveBy(stepX, stepY);
      movedX += stepX;
      movedY += stepY;
      window.requestAnimationFrame(step);  // repeat
    } else {
      // Complete the animation.
      block.moveBy(dx - movedX, dy - movedY);
    }
  }
  step();
};


//Jibo functions
function jiboSay(tts) {
	console.log(tts);
	//return tts;
	//return window.robot.say(tts);

}

function jiboSay(tts) {
	console.log(tts);
	//return tts;
	//return window.robot.say(tts);

}

function jiboShowImage(filename) {
	const path = "http://"+metadata.ip+":8080/" + filename;
	console.log(path);
	actualImage = window.robot.showRemoteImage(path);
}

function jiboHideImage() {
	if (actualImage) {
			actualImage.cancel();
			actualImage = null;
	}
}