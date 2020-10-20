
let socket;
let hostButton, pButton, dButton;
let startButton = 0;
let w,h;
let ID = 0;
let start = 0;
let r = 1;
let dConnected = 0;
let pConnected = 0;
let clientsJoined = 0;
let initLevel = 0;
let initLevelHost = 0;
let hostInitiating = 0;
let qs = 0;
let qNum = 0;
let question = '';
let questionIsAsked = 0; 
let inputCreated = 0;
let inp, subButton, answer;
let pAns, dAns, pAnswered, dAnswered;
let reqResults = 0;
let startResults = 0;
let qHandler;
let showScore = 0;
let pScore, dScore;
let askedNext = 0;
let endGame = 0;
let cw;
let correctButton, wrongButton;
let askedpin = 0;
let pin;
////////////////////////////////////////////////////////////////////

let joinQRimg, joinw, pConimg, dConimg, pAnsimg, dAnsimg, modern20, resultsbg, bgm, zip, startfx;
function preload() {
  joinQRimg = loadImage('https://cdn.glitch.com/273afa4c-504e-4322-9a02-7053f756876e%2FJoinWebQR.png?v=1601554507118');
  pConimg 	= loadImage('images/pCon.png');
  dConimg 	= loadImage('images/dCon.png');
  logo 		= loadImage('images/DPFNLogo.png');
  pAnsimg 	= loadImage('images/pAnswered.png');
  dAnsimg 	= loadImage('images/dAnswered.png');
  resultsbg = loadImage('images/resultsbg.png');
  modern20  = loadFont('modern-no-20.ttf');
  bgm = loadSound('audio/soundtrack.mp3');
  zip = loadSound('audio/zip.mp3');
  startfx = loadSound('audio/start.mp3');
}
///////////////////////////////////////////////////////////////////////

function setup() {
  
  // canvas setup
  w = windowWidth;
  h = windowHeight;
  
  console.log(w,h);
  // for animation once join
  joinw = w/2-250;
  
  createCanvas(w, h);
  unloadScrollBars();
  
  textFont(modern20);
  textSize(50);
  textAlign(CENTER, CENTER);
  
  // socket = io.connect('http://192.168.1.12:3000');
  socket = io.connect('https://dpfn.glitch.me/' || 'http://10.0.0.17:3000');
  socket.on('clientconnected',whoIsConnected);
  socket.on('startGame',startGame);
  socket.on('initLevel', initiate);
  socket.on('initLevelHost', initiateHost);
  socket.on('hostInitiating', hostInitSeq);
  socket.on('askQuestion', askQuestion);
  socket.on('parseAns', clientAns);
  socket.on('score', setScores);
  socket.on('startResults', startResultsCB);
  socket.on('reset', nextSet);
  
//   let pin = createInput("", "text");
//   pin.position(w/2-100, 4*h/10);
// 	pin.width = 200;
//   while (pin != 2203) {
    
    
//   }
//   pin.hide();
  showButtons();
  
  
}
///////////////////////////////////////////////////////////////////////

function whoIsConnected(data) {
	if (data.name == 'pooths'){
		console.log(data);
		pConnected = 1;
		clientsJoined = data.clientNum;
		joinw = w/2-600;
		if (ID == 'host'){
			zip.play();
		}
	}
	
	if (data.name == 'dooths'){
		console.log(data);
		dConnected = 1;
		clientsJoined = data.clientNum;
		joinw = w/2-600;
		if (ID == 'host'){
			zip.play();
		}
	}	
}

function startGame(data){
	start = data;
}

function showButtons(){
  pButton = buttonID('Pooths', w/2, 1*h/7)
  pButton.id('pButton');
  pButton.class('fade-in');
  
  hostButton = buttonID('Host', w/2, 3*h/7)
  hostButton.id('hostButton');
  hostButton.class('fade-in');
  
  dButton = buttonID('Dooths', w/2, 5*h/7)
  dButton.id('dButton');
  dButton.class('fade-in');
  
  
}

function initiate(data){
	initLevel = data;
}


function initiateHost(data){
	initLevelHost = data;
}

function hostInitSeq(data){
	hostInitiating = data;
	initLevelHost = data;
	qs = 1;
	socket.emit('qNum',qNum);
	qNum++;
}

function askQuestion(data) {
	console.log(data);
	question = data.q;
	qHandler = data.qHandler;
	if (question == 'done'){
		endGame = 1;
		console.log("end game");
	} else {
		questionIsAsked = 1;
	}
}

function clientAns(data) {
	if (data.ID == 'pooths') {
		pAns = data.ans;
		pAnswered = 1;
	}
	if (data.ID == 'dooths') {
		dAns = data.ans;
		dAnswered = 1;
	}
}

function startResultsCB(data){
	startResults = data;
	qs = 0;
}

function setScores(data) {
	pScore = data.pScore;
	dScore = data.dScore;
	cw = data.cw;
	showScore = 1;
	startResults = 0;	
}

function nextSet(data) {
	showScore = 0;
	startResults = 0;
	questionIsAsked = 0;
	question = "";
	initLevel = 0;
	initLevelHost = 0;
	hostInitiating = 0;
	qs = 0;
	inputCreated = 0;
	pAns = [];
	dAns = [];
	pAnswered = 0;
	dAnswered = 0;
	reqResults = 0;
	start = 0;
	console.log(qNum);
	qHandler = 0;
	askedNext = 0;
	if (correctButton){correctButton.hide();}
	if (wrongButton){wrongButton.hide()};
	if (subButton){subButton.hide()};
	if (inp) {inp.hide()};
	loop();
	startGame();
}

/////////////////////////////////////////////////////////////////

function draw() {
  // put drawing code here
	background(0);
	
	//////////////////////////////////////////////////////////////////////////////////////////
	// INITIALIZE GAME
	if (start == 0) {
		// HOST
		if (ID == 'host'){
      if (askedpin == 0) {
        if (!pin) {
          pin = createInput("", "password");
          pin.position(w/2, 4*h/10);
          pin.size(100,50);
          pin.id('pin');
                    
        }
        
        fill(255);
        textSize(30);
        text("Enter PIN:", w/2+50,h/2-150)
        
        if (pin.value() == "2203"){
          pin.hide();
          askedpin = 1;
          bgm.loop();
        }
      } else {
        hostopen = ellipse(w/2,h/2,r,r);

        if (r < w || r < h) {
          r = 1.1*r;
        } else {
          image(joinQRimg, joinw, h/2-250, 500, 500);
          //image(logo, 3*w/4, h/5, 200, 200);

          if (pConnected == 1) {
            image(pConimg,w/2,4*h/10,500,104.5);
          }

          if (dConnected == 1) {
            image(dConimg,w/2,6*h/10,500,104.5);
          }	
        }			
      }
    }

    if (ID == 'pooths' && clientsJoined == 3){
      
      if (startButton == 0) { 
        startButton = createButton('Start');
        startButton.position(w/2-50,h/2-30);
        startButton.size(100,60);
        startButton.id('startButton');
        startButton.class('fade-in');
        startButton.mousePressed(startGame);
      }
    } 
    
	} 
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Host levels
	if (start == 1 && ID == 'host'){
		if (initLevelHost == 1) {
			image(logo,w/4,h/2-w/4,w/2,w/2);
			
			if (hostInitiating == 0) { 
				hostInitiating = 1;
				socket.emit('hostInitiating',hostInitiating)
			}
			
		}
		if (qs == 1){
			// text('Question 1', w/2, h/4);
			textSize(70);
			text(question, 20, 20, w-40, h-300);
			
			fill(34, 118, 242);
			
			// ADD CHECK FOR WHETHER CLIENT ANSWERED //
			if (pAnswered == 1) {
				image(pAnsimg, 4*w/6, 3*h/5, 250, 250)
			}
			if (dAnswered == 1) {
				image(dAnsimg, 1*w/6, 3*h/5, 250, 250)
			}
			
			if (pAnswered == 1 && dAnswered == 1) {
				socket.emit('reqResults', 1);
				r = 1;
			}
			
		}
		if (startResults == 1) {
			textSize(40);
			fill(34, 118, 242);
			text(question, w/2, 1*h/7);
			fill(20)
			rect(0, 2*h/7, w, h);
			textSize(70);
			fill(230);
			text('Results:', w/2, 3*h/7);
      textSize(50)
			text('Dooths says:\n' + dAns, 1*w/6, 5*h/8)
			text('Pooths says:\n' + pAns, 5*w/6, 5*h/8)
			initLevel = 0;
			
			
		}
		
		if (showScore == 1) {
			startResults = 0;
			background(0);
			fill(20);
			rect(0,0,w/2,h);
			textSize(60);
			fill(34, 118, 242);
			text('Dooths', 2*w/8, 2*h/8)
			textSize(90);
			text(dScore, 2*w/8, 4*h/8)
			
			if (cw == 1) {
				fill(5,102,8);
				textSize(60);
				text('Correct', w/2, 3*h/4);
			}

			if (cw == 0) {
				fill(139,0,0);
				textSize(60);
				text('Wrong', w/2, 3*h/4);
			}
			
			textSize(60);
			fill(34, 118, 242);
			text('Pooths', 6*w/8, 2*h/8)
			textSize(90);
			text(pScore, 6*w/8, 4*h/8)
			
			socket.emit('nextq', 1);
			noLoop();	
			
		}
		if (endGame == 1) {
			question = '';
			if (dScore > pScore) {
				textSize(90);
				text('Holy shit,\n\nDOOTHS WINS',w/2,h/3);			
			}
			if (pScore > dScore) {
				textSize(90);
				text('Holy shit,\n\nPOOTHS WINS',w/2,h/3);			
			}
			if (pScore == dScore) {
				textSize(90);
				text("Holy shit,\n\nIT'S A TIE",w/2,h/3);			
			}
		}
			
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Client levels
	if (start == 1 && ID != 'host') {
		
		if (questionIsAsked == 1) {
			image(logo, w/2-w/8, w/4, w/4, w/4);
			initLevel = 0;
			if (inputCreated == 0) {
				if (!inp) {
					inp = createInput('','text');
          inp.id('inp');
				}
				inp.show();
				inp.value("");
				inp.position(w/2-150, 4*h/10);
				inp.width = 200;
				if (!subButton) {
					subButton = createButton('submit');
          subButton.id('subButton');
					//console.log('button created');
				}
				subButton.show();
				subButton.position(inp.x + inp.width + 5, inp.y);
				subButton.mousePressed(submit);
				noLoop();
			}
		}
		
		if (initLevel == 1) {
			image(logo,w/4,h/2-w/4,w/2,w/2);
		}
		if (showScore == 1) {
			if (correctButton){correctButton.hide();}
			if (wrongButton){wrongButton.hide()};
			image(logo,w/4,h/2-w/4,w/2,w/2);
		}
		
		if (startResults == 1 && qHandler == ID) {
			if (!correctButton) {
				correctButton = createButton('correct');
				console.log('correctButton created');
        correctButton.id('correctButton');
        correctButton.class('fade-in');
			}
			correctButton.show();
			correctButton.position(1*w/6-5,3*h/4);
			correctButton.mousePressed(correct);
			
			if (!wrongButton){
				wrongButton = createButton('wrong');
				console.log('wrongButton created');
        wrongButton.id('wrongButton');
        wrongButton.class('fade-in');
			}
			wrongButton.show();
			wrongButton.position(4*w/6-5,3*h/4);
			wrongButton.mousePressed(wrong);
			noLoop();
		}
			
	}
	
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function submit() {
	answer = {
		ID: ID, 
		ans:inp.value()
		};
	console.log(answer);
	questionIsAsked = 0;
	initLevel = 1;
	socket.emit('answer', answer);
	inp.hide();
	subButton.hide();
	inp.value("");
	zip.play();
	loop();
}

function correct() {
	socket.emit('correct/wrong', 1)
	correctButton.hide();
	wrongButton.hide();
	showScore = 1;
	startResults = 0;
	cw = 1;
	zip.play();
	
	loop();
	
	correctButton.hide();
	wrongButton.hide();
	
}

function wrong() {
	socket.emit('correct/wrong', 0)
	correctButton.hide();
	wrongButton.hide();
	showScore = 1;
	startResults = 0;
	cw = 0;
	zip.play();
	
	loop();
	
	correctButton.hide();
	wrongButton.hide();
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startLevel() {
	initLevelHost = 0;
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ID BUTTON FUNCTION

// define a button
function buttonID(label,posx,posy) {
	let button = createButton(label);
	let buttonw = windowWidth/2;
	let buttonh = windowWidth/10;
	button.position(posx-buttonw/2,posy-buttonh/2);
	button.size(buttonw,buttonh);
	
	if (label == 'Host') {
		button.mousePressed(hostConn);
	} else if (label == 'Pooths') {
		button.mousePressed(poothsConn);
	} else if (label == 'Dooths') {
		button.mousePressed(doothsConn);
	}
	
	return button;
	
}

/////////////////////////////////////////////////////////////////////////////////


// START PAGE BUTTON CALLBACKS
function hostConn() {
	ID = 'host';
	// console.log('host connected');
	socket.emit('ID', ID);
	hideButtons();
	zip.play();
	// bgm.loop();
}

function poothsConn() {
	ID = 'pooths';
	// console.log('pooths connected');
	socket.emit('ID', ID);
	hideButtons();
}

function doothsConn() {
	ID = 'dooths';
	// console.log('dooths connected');
	socket.emit('ID', ID);
	hideButtons();
}

function startGame(){
	if (start == 0) {
		start = 1;
		socket.emit('start', start);
		if (ID == 'pooths'){
			startButton.hide();
			// console.log('start button hidden');
		}
		if (ID == 'host') {
			startfx.play();
		}
		initLevel = 1;
		socket.emit('initLevel',initLevel);
		initLevelHost = 1;
		socket.emit('initLevelHost',initLevelHost);
	}
}

//////////////////////////////////////////////////////////////////////////////


function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  
    document.body.scroll = "no";
}

function hideButtons() {
	hostButton.hide();
	dButton.hide();
	pButton.hide();
}