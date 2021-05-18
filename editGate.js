

//////////////////////////////////////////////////////////////////////
//                          editGate                                //
//////////////////////////////////////////////////////////////////////


function editGate() {

	this.name = 'edit gate'
	
	var panel, gate, img, sceneSelect, buffer, frameContainer;

	this.setup = function(){
		buffer = 10 // user can click 10px outside the canvas

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
		cursor('crosshair');
		if(img){
			imageMode(CORNER)
			image(img, 0, 0, width, height);
		}

		stroke(0,0,0)
		fill(127,127,127,150)
		strokeWeight(4)
		beginShape();
		for(let i = 0; i < gate.poly.length ; i+=2){
			vertex(gate.poly[i], gate.poly[i+1]);
		}
		endShape(CLOSE);

		
		stroke(0,0,0)
		fill(255,255,255)
		strokeWeight(1)
		strokeJoin(BEVEL);
		for(let i = 0; i < gate.poly.length ; i+=2){
			ellipse(gate.poly[i], gate.poly[i+1],7,7);
		}

		stroke(255,255)
		noFill();
		strokeWeight(2)
		beginShape();
		for(let i = 0; i < gate.poly.length ; i+=2){
			vertex(gate.poly[i], gate.poly[i+1]);
		}
		endShape(CLOSE);


		
	};

	this.mousePressed = function(){
		if(mouseX+buffer > 0 && mouseY+buffer > 0 && mouseX-buffer < width && mouseY-buffer < height){
			addPoint(constrain(mouseX,0,width), constrain(mouseY,0,height));
		}
	}

	function removeGate(){
		game.scenes[sceneIndex].gates.splice(gateIndex, 1);
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
		gate.poly.push(x, y);
	}

	function next(){
		mgr.showScene(editScene);
	}
}

