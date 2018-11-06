//ctx must be defined

class Tank{


	//controls = [up,right,down,left,fire,special] e.g. ['a',"ArrowRight"]
	constructor(x,y,maze,controls,colour="black"){
		this.x=x;
		this.y=y;
		this.controls=controls;
		this.colour=colour;
		this.maze=maze;
		maze.tanks.push(this);

		this.width=maze.width/maze.num_of_columns/3;
		this.height=maze.height/maze.num_of_rows/3;
		this.rotation=0;

		var o=this.maze.squares[0][0];
		this.move_speed=MOVE_SPEED *Math.min(o.width,o.height)/60;
		this.rotation_speed=ROTATION_SPEED;
		

		this.upPressed=false;
		this.rightPressed=false;
		this.downPressed=false;
		this.leftPressed=false;


		document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		document.addEventListener("keyup", this.keyUpHandler.bind(this), false);

	}


	draw(){
		this.handleMovement();
		ctx.save();
		
		ctx.translate( this.x+this.width/2, this.y+this.height/2 );
		ctx.rotate(this.rotation);

		if(this.hasOwnProperty("img")){
			ctx.drawImage(this.img,-this.width/2,-this.height/2,this.width,this.height);
		}
		else{
			ctx.fillStyle=this.colour;
			ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
		}
		ctx.restore();
		
	}

	loadImage(img_element){
		this.img=img_element;
	}


	//Called every iteration of draw. Checks to see if buttons are pressed and moves tank accordingly.
	handleMovement(){
		var x=this.x;
		var y=this.y;
		var ms=this.move_speed;

		//Attempts to move in x and y directions seperately. This means if tank is driving into wall at an angle, it will move parrallel to wall.
		if(this.upPressed){
			this.tryMovingTo([this.x+this.move_speed*Math.sin(this.rotation),this.y]);
			this.tryMovingTo([this.x,this.y-this.move_speed*Math.cos(this.rotation)]);
		}
		if(this.rightPressed){this.rotation+=this.rotation_speed;}
		if(this.downPressed){
			this.tryMovingTo([this.x-this.move_speed*Math.sin(this.rotation),this.y]);
			this.tryMovingTo([this.x,this.y+this.move_speed*Math.cos(this.rotation)]);
		}
		if(this.leftPressed){this.rotation-=this.rotation_speed;}
	}

	originalMovement(){
		var x=this.x;
		var y=this.y;
		var ms=this.move_speed;

		if(this.upPressed){this.tryMovingTo([this.x,this.y-this.move_speed]);}
		if(this.rightPressed){this.tryMovingTo([this.x+this.move_speed,this.y]);}
		if(this.downPressed){this.tryMovingTo([this.x,this.y+this.move_speed]);}
		if(this.leftPressed){this.tryMovingTo([this.x-this.move_speed,this.y]);}
	}

	
	//Helper for handleMovement(). Tries to move the tank to x,y. Will fail if maze.doesRectCollide(tank) returns false.
	tryMovingTo(pos){
		var x = pos[0];
		var y = pos[1];

		if(!this.maze.doesRectCollide([x,y,this.width,this.height])){
			this.x=x;
			this.y=y;
		}
	}
	
		
	//ar=[x,y]
	
	keyDownHandler(e){
	
		if(e.key == this.controls[0]){this.upPressed=true;}
		if(e.key == this.controls[1]){this.rightPressed=true;}
		if(e.key == this.controls[2]){this.downPressed=true;}
		if(e.key == this.controls[3]){this.leftPressed=true;}
	}

	keyUpHandler(e){

		if(e.key == this.controls[0]){this.upPressed=false;}
		if(e.key == this.controls[1]){this.rightPressed=false;}
		if(e.key == this.controls[2]){this.downPressed=false;}
		if(e.key == this.controls[3]){this.leftPressed=false;}
	}

}

