
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
