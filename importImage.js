
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
		cursor('default')
		img = undefined;
		x = width/2;
		y = height/2;
		scale = 1;
		
		panel.show();
	};

	this.draw = function(){
		background(0);
		if(img){
			if(mouseLocked){
				cursor('grabbing');
			}
			else {
				cursor('grab')
			}
			imageMode(CENTER)
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
		x = width/2;
		y = height/2;
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

