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

		var o=this.maze.squares[0][0];
		this.move_speed=Math.min(o.width,o.height)/12;
		

		this.upPressed=false;
		this.rightPressed=false;
		this.downPressed=false;
		this.leftPressed=false;


		document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
		document.addEventListener("keyup", this.keyUpHandler.bind(this), false);

	}
	draw(){
		ctx.fillStyle=this.colour;
		ctx.fillRect(this.x,this.y,this.width,this.height);

		var new_location = [this.x,this.y];

		var up = false;
		var right = false;
		var left = false;
		var down = false;
		
		if(this.upPressed)
		if(this.isValidPosition([this.x,this.y-this.move_speed])) {up=true;}
		
		if(this.downPressed)
		if(this.isValidPosition([this.x,this.y+this.move_speed])){down=true;}

		if(this.rightPressed)
		if(this.isValidPosition([this.x+this.move_speed,this.y])){right=true;}

		if(this.leftPressed)
		if(this.isValidPosition([this.x-this.move_speed,this.y])){left=true;}

		if(up){this.y-=this.move_speed}
		if(down){this.y+=this.move_speed}
		if(right){this.x+=this.move_speed}
		if(left){this.x-=this.move_speed}
	}
	
	

		
	
	isValidPosition(pos){
		var square = this.maze.getSquareAtXY(pos);
		var x=pos[0];
		var y=pos[1];

		if(x<square.x+square.wall_thiccness){if(square.west){return false;}}
		if(x+this.width>square.x+square.width){if(square.east){return false;}}
		if(y<square.y+square.wall_thiccness){
			if(square.north){return false;}
			

		}
		if(y+this.height>square.y+square.height){if(square.south){return false;}}



		return true

	}
	
		
	//ar=[x,y]
	setPosition(ar){
		this.x=ar[0];
		this.y=ar[1];
	}
	getPosition(){
		return [this.x,this.y]
	}
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

