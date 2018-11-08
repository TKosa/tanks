
class Bullet{


	constructor(tank,direction,x,y,radius=1){
		this.tank=tank;

		//array len-2 with x-velocity and y-velocity 
		this.direction=direction;

		//x,y are center of circle
		this.x=x;
		this.y=y;

		this.radius=radius;
	}


	draw(){

	this.handleMovement();
	this.handleTankCollisions();


	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.strokeStyle = this.tank.colour;
	ctx.lineWidth = 1;

    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);	
    ctx.fill();  
    ctx.stroke(); 

	}

	handleMovement(){

		if(!this.tank.maze.doesRectCollide([this.x-this.radius + this.direction[0],this.y-this.radius, this.radius,this.radius])){
			this.x+=this.direction[0];
		}
		else{
			this.direction[0]*=-1;
		}

		if(!this.tank.maze.doesRectCollide([this.x-this.radius,this.y-this.radius + this.direction[1], this.radius,this.radius])){
			this.y+=this.direction[1];
		}
		else{
			this.direction[1]*=-1;
		}
	}

	handleTankCollisions(){
		this.tank.maze.tanks.forEach(function(tank){

			//Tanks cannot shoot themselves
			if(!(tank==this.tank)){

				//Check if bullet and tank overlaps
				if(doRectsOverlap([tank.x,tank.y,tank.width,tank.height],[this.x-this.radius,this.y-this.radius,this.radius*2,this.radius*2])){
					
					tank.destroy();
					tank.maze.tanks.splice(tank.maze.tanks.indexOf(tank),1);
					
				}
			}
		},this);
	}

	
}