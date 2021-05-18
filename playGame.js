
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

		gameContainer = select('#imgmGame')
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
		createImg(scene.imageData || defaultImage, str(i))
			.id(i)
			.attribute('usemap', '#'+i)
			.style('width', '100%')
			.style('height', '100%')
			.parent(gameContainer);
	}
	
	function generateGame(){
		for(let i=0; i < game.scenes.length; i++){
			generateMap(i);
			generateImg(i);
		}
	}
	
	function exportGame(){

		let page = [];
		let values = {
			mood:getToolsMoodText(),
			imgmGame:gameContainer.elt.outerHTML
		};
		for (let i=0; i<template.length; i++){
			page.push(formatString(template[i], values));
		}
		saveStrings(page, 'game', 'html');
	}
	
	function edit(){
		mgr.showScene(editScene);
	}
}


