
//////////////////////////////////////////////////////////////////////
//                           home                                   //
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

		createElement('hr')
			.parent(panel)
		createSpan('import a game:')
			.parent(panel)
		createFileInput(importGame)
			.parent(panel)
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

	function importGame(file){
		let tempDiv = createDiv(file.data).hide()
		print(tempDiv)
		let imgmGame = select('#imgmGame', tempDiv)
		if(imgmGame){
			let images = selectAll('img', imgmGame);
			let maps = selectAll('map', imgmGame);
			let scenes = []
			for(let i=0; i<images.length; i++){
				let imageData = images[i].attribute('src')
				let gates = []
				let areas = selectAll('area', maps[i])
				for(let j=0; j<areas.length; j++){
					let gate = {
						poly:int(split(areas[j].attribute('coords'), ',')),
						sceneId:areas[j].attribute('href').substring(1)
					};
					gates.push(gate);
				}
				let scene = {
					imageData:imageData,
					gates:gates
				}
				scenes.push(scene);
			}
			tempDiv.remove()
			game = {
				scenes:scenes
			};
			sceneIndex = 0;
			mgr.showScene(editScene);
			return true;
		}
		else {
			return false;
		}
	}
	
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
