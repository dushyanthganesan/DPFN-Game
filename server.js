let dquestions;
let pquestions;
let questions;
let qLength;
let qHandler;
let qNum;
let express = require('express');
let app = express();
let server = app.listen(3000);
let pScore = 0;
let dScore = 0;

let clients = 0;

app.use(express.static('public')); // host static files

console.log("Server running.");

let socket = require('socket.io');

let io = socket(server);
io.sockets.on('connection',newConnection);

function newConnection(socket) {
	console.log('new connection: ' + socket.id);
	
	/////////////////////
	// Identify and initialize
	socket.on('ID', msgID);
	
	function msgID(data){
	console.log(data);
	if (data == 'host'){
	clients = 0;
	}
	clients++;
	let clientdata = {
		name: data,
		clientNum: clients
	}
	io.sockets.emit('clientconnected',clientdata);
	}
	
	////////////////////////
	
	// look for start
	socket.on('start',start);
	
	function start(data){
		if (data == 1){
			io.sockets.emit('startGame', 1);
		}
	}
	
	///////////////////////////
	socket.on('initLevel',initiate);
	
	function initiate(data){
		io.sockets.emit('initLevel',data);
	}
	
	////////////////////////////
	socket.on('hostInitiating',initSeq);
	
	function initSeq(data) {
		if (data == 1) {
			setTimeout(stopInit,5000);
		}
		function stopInit(){
			io.sockets.emit('hostInitiating',0);
		}
	}
	
	///////////////////////////////////////
	socket.on('qNum', giveQ);
	
	function giveQ(data) {
		qNum = data;
		// console.log(data);
		
		if (qNum%2 == 0){
			qHandler = 'pooths';
		} else {
			qHandler = 'dooths';
		}
		
		if (qNum > qLength-1) { 
			question = {
				q: 'done', 
				qHandler: qHandler
				};
		} else {
			question = {
				q: questions[qNum], 
				qHandler: qHandler
			};
		}
		io.sockets.emit('askQuestion', question);
	}
	
	////////////////////////////////////////
	socket.on('answer', parseAns);
	
	function parseAns(data){
		answer = data;
		// console.log(answer);
		io.sockets.emit('parseAns', answer);
	}
	
	////////////////////////////////////////////
	socket.on('reqResults', results);
	
	function results(data){
		if (data == 1) {
			setTimeout(startResults,3000);
		}
		function startResults(){
			io.sockets.emit('startResults',1);
		}
	}
	
	/////////////////////////////////////////
	socket.on('correct/wrong', cw);
	
	function cw(data) {
		if (qHandler == 'pooths') {
			dScore = dScore + data*100;
		}
		if (qHandler == 'dooths') {
			pScore = pScore + data*100;
		}
		scores = {
			cw: 	data,
			pScore: pScore, 
			dScore: dScore
		};
		io.sockets.emit('score', scores);
			
	}
	
	//////////////////////////////////////////////////////////
	socket.on('nextq', sendReset)
	
	function sendReset(data) {
		setTimeout(emitReset,5000);
		
		function emitReset() {
			io.sockets.emit('reset', 1);
		}
	}
}
//////////////////////////////////////////////////////////////////////
////////////////////******INPUT********/////////////////////


let fs = require('fs');

dquestions = fs.readFileSync('./doothsQuestions.txt').toString('utf-8').split('\r\n');
console.log(dquestions);

pquestions = fs.readFileSync('./poothsQuestions.txt').toString('utf-8').split('\r\n');


///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

questions = [];

if (pquestions.length != dquestions.length) {
	console.warn("ERROR: UNEQUAL NUMBER OF QUESTIONS"); 
	console.log("p = " + pquestions.length + "\td = " + dquestions.length);
	process.exit();
}
	

for (let ii = 0; ii < dquestions.length; ii++) {
	questions[2*ii+1] = dquestions[ii];
	questions[2*ii] = pquestions[ii];
}

qLength = questions.length;
console.log(qLength);
console.log(questions);
