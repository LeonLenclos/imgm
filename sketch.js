// imgm

//////////////////////////////////////////////////////////////////////
//                           main                                   //
//////////////////////////////////////////////////////////////////////

// Shared variables
let mgr, cnv, dropedFile, game, mood, sceneIndex, gateIndex, toolPanelsContainer, status;

// Game settings
let gameWidth = 800;
let gameHeight = 600;

function setup() {
	// Dom
	cnv = createCanvas(gameWidth, gameHeight);
	cnv.parent('canvasContainer');
	cnv.drop(gotFile);
	toolPanelsContainer = select('#toolPanelsContainer');
	statusBar = select('#statusBar');
	
	// Game
	game = getItem('game');
	
	// Scene Manager
	mgr = new SceneManager();
	mgr.showScene(home);

	// Mood
	mood = getItem('mood')
	if(mood === null){
		mood = 60;
	}

	// style
	stroke('grey');
}

function draw(){
	if(frameCount%600 == 0){
		storeItem('game', game);
		storeItem('mood', mood)
	}
	mood -= 0.02;	
	mood = constrain(mood, 0, 100);

	mgr.draw();
	let mgrSceneName = mgr.scene?mgr.scene.oScene.name:''
	let newStatus = '<span><b>mode:</b> '+mgrSceneName+'</span><span><b>scene:</b> '+sceneIndex+'</span><span><b>mood:</b> '+getToolsMood()+'</span>';
	if(status != newStatus){
		status = newStatus;
		statusBar.html(status);
	}
}

function mouseMoved(){
	mood += 0.1
}

function mousePressed(){
    mgr.handleEvent("mousePressed");
}

function mouseDragged(){
    mgr.handleEvent("mouseDragged");
}

function mouseReleased(){
    mgr.handleEvent("mouseReleased");
}

function keyPressed(){
    mgr.handleEvent("keyPressed");
}

function gotFile(file){
	dropedFile = file;
	mgr.handleEvent("gotFile");
	if (file.type === 'image') {
		mgr.handleEvent('gotImage');
	}
}

function resetSceneSelect(element, index){
	element.html('');
	for(i=0; i<game.scenes.length; i++){
		element.option(i)
	}
	element.option(game.scenes.length + ' (new)', game.scenes.length)
	element.selected(index)
}

function getToolsMood(){
	let moods = ['<3', ':)', ':|', ':('];
	return moods[floor(map(mood, 100, 0, 0, moods.length-1))]
}

function getToolsMoodText(){
	let moods = ['in love', 'happy', 'bored', 'sad'];
	return moods[floor(map(mood, 100, 0, 0, moods.length-1))]
}


// Add a new scene to the game and returns the new scene index.
function newScene(){
	sceneId = game.scenes.length-1;
	scene = {
		imageData:'',
		gates:[],
		sceneId:sceneId,
	};
	return game.scenes.push(scene)-1;
}

// Add a new gate to the game and returns the new gate index.
function newGate(){
	gate = {
		poly: [],
		sceneId: '',
	};
	return game.scenes[sceneIndex].gates.push(gate)-1;
}

// Return true if the mouse is in the given poly.
// Poly must be a coords array.
function mouseInPoly(poly){
	var vectorArray = []
	for(let i = 0; i < poly.length ; i+=2){
		vectorArray.push(createVector(poly[i], poly[i+1]));
	}
	return collidePointPoly(mouseX, mouseY, vectorArray);

}

//////////////////////////////////////////////////////////////////////
//                         home                                     //
//////////////////////////////////////////////////////////////////////

function home(){

	this.name = 'home';
	
	let panel, img, x, y, scale, xOffset, yOffset, mouseLocked;

	this.setup = function(){
		panel = createDiv()
			.parent(toolPanelsContainer)
			.hide();
		
		createButton('start a new game')
			.mousePressed(newGame)
			.parent(panel);
		if(game){
			createButton('continue working on the game')
				.mousePressed(continueGame)
				.parent(panel);
		}
	}
	
	this.enter = function(){
		background(0);
		fill(255);
		textAlign(CENTER);
		text('welcome to imgm !', width/2, height/2);

		panel.show();
	};

	this.exit = function (){
		panel.hide();
	};
	
	function newGame(){
		game = {
			scenes: [],
		};
		sceneIndex = newScene();
		mgr.showScene(editScene);
	};
	

	function continueGame(file){
		sceneIndex = 0;
		mgr.showScene(editScene)
	};
}


//////////////////////////////////////////////////////////////////////
//                       importImage                                //
//////////////////////////////////////////////////////////////////////

function importImage(){

	this.name = 'import image';
	
	let panel, img, x, y, scale, xOffset, yOffset, mouseLocked;

	this.setup = function(){
		panel = createDiv()
			.parent(toolPanelsContainer)
			.hide();
		
		createFileInput(loadImage)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createButton('increase size')
			.mousePressed(scaleUp)
			.parent(panel);
		createButton('decrease size')
			.mousePressed(scaleDown)
			.parent(panel);
		createButton('reset size')
			.mousePressed(resetScale)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createButton('ok')
			.mousePressed(next)
			.parent(panel);
	}
	
	this.enter = function(){
		img = undefined;
		x = 0;
		y = 0;
		scale = 1;
		
		background(0);
		fill(255);
		text('...', width/2, height/2);

		panel.show();
	};

	this.draw = function(){
		if(img){
			background(0);
			image(img, x, y, img.width * scale, img.height * scale);
		}
	};
	
	this.gotImage = function(){
		loadImage(dropedFile);
	};


	this.mousePressed = function(){
		mouseLocked = true;
		xOffset = mouseX - x;
		yOffset = mouseY - y;
	}

	this.mouseDragged = function(){
		if(mouseLocked && img){
			x = mouseX - xOffset;
			y = mouseY - yOffset;
		}
	}

	this.mouseReleased = function(){
		mouseLocked = false;
	}


	this.exit = function (){
		panel.hide();
		if(img){
			img.remove();
		}
	};
	
	function resetScale(){
		x = 0;
		y = 0;
		scale = max(width/img.width, height/img.height);
	};

	function scaleUp(){
		scale *= 1.2;
	};

	function scaleDown(){
		scale *= 0.8;
	};

	function next(){
		game.scenes[sceneIndex].imageData = cnv.elt.toDataURL('image/png')
		mgr.showScene(editScene);
	};
	

	function loadImage(file){
		if(img){
			img.remove();
		}
		img = createImg(file.data, 'droped image', '', resetScale).hide();
	};
}



//////////////////////////////////////////////////////////////////////
//                   editScene                                      //
//////////////////////////////////////////////////////////////////////

function editScene() {

	this.name = 'edit scene';
	
	var panel, scene, img, sceneSelect;

	this.setup = function(){
		panel = createDiv()
			.parent(toolPanelsContainer)
			.hide();
		createButton('add a gate')
			.mousePressed(addGate)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createButton('change image')
			.mousePressed(showImportImage)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createSpan('select another scene:')
			.parent(panel);
		sceneSelect = createSelect()
			.changed(sceneSelectChanged)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createButton('play the game')
			.mousePressed(showPlayGame)
			.parent(panel);
	}
	
	this.exit = function(){
		panel.hide();
	};
	
	this.enter = function(){
		panel.show();
		
		scene = game.scenes[sceneIndex]
		if(!scene.imageData){
			mgr.showScene(importImage);
		} else {
			img = loadImage(scene.imageData);
		}

		resetSceneSelect(sceneSelect, sceneIndex);
	};

	this.draw = function(){
		background(0);
		if(img){
			image(img, 0, 0);
		}

		for(let i=0; i < scene.gates.length; i++){
			let gate = scene.gates[i]
			strokeWeight(1);
			fill(255,255,255,100);
			if(mouseInPoly(gate.poly)){
				strokeWeight(2);
				fill(255,255,255,200);
			}
			beginShape();
			for(let i = 0; i < gate.poly.length ; i+=2){
				vertex(gate.poly[i], gate.poly[i+1]);
			}
			endShape(CLOSE);
		}
	};

	this.mousePressed = function(){
		if(scene){
			for(let i=0; i < scene.gates.length; i++){			
				if(mouseInPoly(scene.gates[i].poly)){
					gateIndex = i;
					mgr.showScene(editGate);
				}
			}
		}
	};

	function createNewScene(){
		sceneIndex = newScene();
		mgr.showScene(editScene);
	}
	function sceneSelectChanged(){
		sceneIndex = int(sceneSelect.value());
		if(sceneIndex == game.scenes.length){
			newScene();
		}
		mgr.showScene(editScene);
	}
		
	function addGate (){
		gateIndex = newGate();
		mgr.showScene(editGate);
	}

	function showImportImage (){
		mgr.showScene(importImage);
	}

	function showPlayGame (){
		mgr.showScene(playGame);
	}
}


//////////////////////////////////////////////////////////////////////
//                          editGate                                //
//////////////////////////////////////////////////////////////////////


function editGate() {

	this.name = 'edit gate'
	
	var panel, gate, img, sceneSelect;

	this.setup = function(){
		panel = createDiv()
			.parent(toolPanelsContainer)
			.hide();
		
		createButton('reset polygon')
			.mousePressed(resetPoly)
			.parent(panel);
		createButton('remove gate')
			.mousePressed(removeGate)
			.parent(panel)
		createElement('hr')
			.parent(panel);
		createSpan('target scene:')
			.parent(panel);
		sceneSelect = createSelect()
			.changed(sceneSelectChanged)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createButton('ok')
			.mousePressed(next)
			.parent(panel);
	}
	
	this.exit = function(){
		panel.hide();
	};
	
	this.enter = function(){
		panel.show();
		img = loadImage(game.scenes[sceneIndex].imageData);
		gate = game.scenes[sceneIndex].gates[gateIndex];
		resetSceneSelect(sceneSelect, gate.sceneId);
	};

	this.draw = function(){
		background(0);
		if(img){
			image(img, 0, 0);
		}

		fill(255,255,255,150)
		strokeWeight(3)
		beginShape();
		for(let i = 0; i < gate.poly.length ; i+=2){
			vertex(gate.poly[i], gate.poly[i+1]);
		}
		endShape(CLOSE);
	};

	this.mousePressed = function(){
		if(mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height){
			addPoint(mouseX, mouseY);
		}
	}

	function removeGate(){
		game.scenes[sceneIndex].gates.pop(gateIndex);
		mgr.showScene(editScene)
	}

	function sceneSelectChanged(){
	
		let sceneId = int(sceneSelect.value());
		if(sceneId == game.scenes.length){
			newScene();
		}
		gate.sceneId = sceneId;
		resetSceneSelect(sceneSelect, sceneId);
	}
		
	function resetPoly(){
		gate.poly = [];
	}

	function addPoint(x, y){
		gate.poly.push(x);
		gate.poly.push(y);
	}
	function next(){
		mgr.showScene(editScene);
	}
}


//////////////////////////////////////////////////////////////////////
//                     playGame                                     //
//////////////////////////////////////////////////////////////////////


function playGame() {

	this.name = 'play game'
	
	let panel, gameContainer;
	this.setup = function(){
		panel = createDiv()
			.parent(toolPanelsContainer)
			.hide();

		gameContainer = select('#gameContainer')
			.style('width', gameWidth + 'px')
			.style('height', gameHeight + 'px')
			.style('overflow', 'hidden')
			.hide();
		
		createButton('export')
			.mousePressed(exportGame)
			.parent(panel);
		createElement('hr')
			.parent(panel);
		createButton('back')
			.mousePressed(edit)
			.parent(panel);
	}
	
	this.exit = function(){
		panel.hide();
		gameContainer.html('');
		gameContainer.hide();
	};
	
	this.enter = function(){
		panel.show();
		gameContainer.show();
		generateGame();
	};

	function generateMap(i){
		let scene = game.scenes[i];
		let mapElement = createElement('map')
			.attribute('name', i)
			.parent(gameContainer);
		for(let j=0; j<scene.gates.length; j++){
			let gate = scene.gates[j];
			createElement('area')
				.attribute('shape', 'poly')
				.attribute('coords', gate.poly.join(','))
				.attribute('href', '#'+gate.sceneId)
				.parent(mapElement);
		}
	}

	function generateImg(i){
		let scene = game.scenes[i];
		createImg(scene.imageData, str(i))
			.id(i)
			.attribute('usemap', '#'+i)
			.parent(gameContainer);
	}
	
	function generateGame(){
		for(let i=0; i < game.scenes.length; i++){
			generateMap(i);
			generateImg(i);
		}
	}
	
	function exportGame(){
		let page = [
			'<!DOCTYPE html><html style="height:100%">',
			'<body style="background:black;margin:0;padding:0;height:100%;display:flex;align-items:center;justify-content: center;">',
			'<!------------------------------',
			'this page was generated by imgm.',
			'imgm was '+getToolsMoodText()+' when it generated this page.', 
			'------------------------------->',
			gameContainer.elt.outerHTML,
			'</body></html>'
		];
		saveStrings(page, 'game', 'html');	
	}
	
	function edit(){
		mgr.showScene(editScene);
	}
}
