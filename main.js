//////////////////////////////////////////////////////////////////////
//                           main                                   //
//////////////////////////////////////////////////////////////////////

// Shared variables
let mgr, cnv, dropedFile, game, mood, sceneIndex, gateIndex, toolPanelsContainer, status, template;

// Game settings
let gameWidth = 800;
let gameHeight = 600;

// ImageData
let defaultImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYCAIAAAAVFBUnAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9Tix9UBa0g4pChOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi5uak6CIl/i8ptIj14Lgf7+497t4BQrXINKttHNB020zEomIqvSq2vyKAPnRiAD0ys4w5SYqj5fi6h4+vdxGe1frcn6NbzVgM8InEs8wwbeIN4ulN2+C8TxxieVklPiceM+mCxI9cVzx+45xzWeCZITOZmCcOEYu5JlaamOVNjXiKOKxqOuULKY9VzluctWKZ1e/JXxjM6CvLXKc5jBgWsQQJIhSUUUARNiK06qRYSNB+tIV/yPVL5FLIVQAjxwJK0CC7fvA/+N2tlZ2c8JKCUSDw4jgfI0D7LlCrOM73sePUTgD/M3ClN/ylKjDzSXqloYWPgN5t4OK6oSl7wOUOMPhkyKbsSn6aQjYLvJ/RN6WB/luga83rrb6P0wcgSV3Fb4CDQ2A0R9nrLd7d0dzbv2fq/f0AFD9ygUu4Qn4AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBRILHTRqIEe9AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAABYtJREFUeNrtwQENAAAAwqD3T20ON6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAVwP8kwAB1rbC6AAAAABJRU5ErkJggg=='

function preload() {
	template = loadStrings('template.html');
}

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
		element.option(i);
	}
	element.option(game.scenes.length + ' (new)', game.scenes.length);
	element.selected(index);
}

function getToolsMood(){
	let moods = ['<3', ':)', ':|', ':('];
	return moods[floor(map(mood, 100, 0, 0, moods.length-1))];
}

function getToolsMoodText(){
	let moods = ['in love', 'happy', 'bored', 'sad'];
	return moods[floor(map(mood, 100, 0, 0, moods.length-1))];
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
		sceneId: '0',
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



function formatString (str, values) {
    for (let key in values) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), values[key]);
    }
    return str;
}

