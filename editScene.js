//////////////////////////////////////////////////////////////////////
//                       editScene                                  //
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
		cursor('crosshair')
		background(0);
		if(img){
			imageMode(CORNER);
			image(img, 0, 0, width, height);
		}

		strokeJoin(ROUND);
		for(let i=0; i < scene.gates.length; i++){
			let gate = scene.gates[i]
			fill(127,127,127,150)
			if(mouseInPoly(gate.poly)){
				cursor('pointer')
				strokeWeight(2);
				fill(255,255,255,150);
			}
			
			stroke(0,0,0)
			strokeWeight(4)
			beginShape();
			for(let i = 0; i < gate.poly.length ; i+=2){
				vertex(gate.poly[i], gate.poly[i+1]);
			}
			endShape(CLOSE);
			
			stroke(255,255)
			noFill();
			strokeWeight(2)
			beginShape();
			for(let i = 0; i < gate.poly.length ; i+=2){
				vertex(gate.poly[i], gate.poly[i+1]);
			}
			endShape(CLOSE);
		}
	};

	this.mousePressed = function(){
		if(scene){
			gateIndex = undefined;
			for(let i=0; i < scene.gates.length; i++){			
				if(mouseInPoly(scene.gates[i].poly)){
					gateIndex = i;
					mgr.showScene(editGate);
				}
			}
			if(gateIndex === undefined && mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height){
				addGate()
				scene.gates[gateIndex].poly.push(mouseX, mouseY);
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

