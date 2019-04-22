class Powerup{

	constructor(maze,x,y,effect_no){
		this.x=x;
		this.y=y;
		this.width=10;
		this.height=10;
		this.maze=maze;
		this.effect_no = effect_no;
		//format for a powerup [name_str, colour_str, fn(tank){powerup_effect(); tank.undo_powerup=reverse_fn(){}}]
		this.powerups = [
			
			["remove bullet limit"
			, "blue"
			,function(tank)
				{
					tank.shouldFire = function() 
					{
						if (this.shooting) {return true;}
						else {return false;}
					}

					tank.undo_powerup=function()
					{
						tank.shouldFire=function()
						{
						if (this.shooting && this.bullets.length<this.bullet_limit) {return true;}
						else {return false;}}
						}
					}
			]


			,["triple shot"
			, "red"
			,	function(tank)
				{
					//setting tank.old_fire=tank.fire caused an inf_recursion bug, so I just copied the defn
					tank.old_fire = function(rotation,speed)
					{
						var x_vel = speed*Math.sin(rotation);
						var y_vel = speed*-Math.cos(rotation);			//x,y _pos are at tip of the cannon
						var x_pos = this.x+this.width/2 + Math.sin(this.rotation)*this.height;
						var y_pos = this.y+this.height/2 + Math.cos(this.rotation)*-this.height;
						var new_bullet = new Bullet(this,[x_vel,y_vel],x_pos,y_pos);			
						this.bullets.push(new_bullet);
					}

					tank.fire = function(rotation, speed){
						this.old_fire(rotation, speed);
						this.old_fire(rotation-Math.PI/12, speed);
						this.old_fire(rotation+Math.PI/12, speed);
					}

					tank.bullet_limit=3*game.bullet_limit;

					tank.undo_powerup = function()
					{
						this.fire = this.old_fire; 
						this.bullet_limit=game.bullet_limit;
					}
				}
				
			]

			,["trippy"
			,"green"
			,function(tank)
			{
				draw = function()
				{	
					game.main();
 					requestAnimationFrame(draw);
				};

				tank.undo_powerup = function()
				{
					draw = function()
					{
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						game.main();
 						requestAnimationFrame(draw);
					};

				};
			}
			]

			,["move through walls"
			,"blue"
			,function(tank)
			{
				tank.tryMovingTo=function(pos){
					var x = pos[0];
					var y = pos[1];

					if(!this.maze.isOutOfBounds([x,y])){
						this.x=x;
						this.y=y;
					}
				}

				tank.undo_powerup = function()
				{
					tank.tryMovingTo=function(pos){
						var x = pos[0];
						var y = pos[1];

						if(!this.maze.doesRectCollide([x,y,this.width,this.height])){
							this.x=x;
							this.y=y;
						}
					}
					var square = tank.maze.getSquareAtXY([tank.x,tank.y]);
					tank.x=square.getCenter()[0];
					tank.y=square.getCenter()[1];
				};
			}
			]	
		];


	}


	getMessage(){
		return this.powerups[this.effect_no][0];
	}


	draw(){
		ctx.lineWidth=1;
		ctx.strokeStyle=this.powerups[this.effect_no][1];
		ctx.strokeRect(this.x,this.y,this.width,this.width);
	}

	onBulletHit(tank){
		
		this.maze.removePowerup(this);

		if(tank.powerup_timeout!=undefined){
			tank.undo_powerup();
			clearTimeout(tank.powerup_timeout);
		}
	
		tank.powerup_timeout=setTimeout(function(){tank.undo_powerup(); tank.powerup_timeout=undefined},game.powerup_duration*1000);

		if(this.new!=1){
			//Apply the powerup
		this.powerups[this.effect_no][2](tank);
		}

		else{
			this.effect(tank);
		}
		
		tank.powerup=this;

	}

	randomize(){
		this.effect_no = Math.floor(this.powerups.length * Math.random());
	}
}

class p_trippy extends Powerup {
	constructor(maze,x,y){
		super(maze,x,y);
		this.new=1;

		this.name = "trippy";
		this.color = "green";
	}

	effect(tank){
			{
				draw = function()
				{	
					game.main();
 					requestAnimationFrame(draw);
				};

			}

	}

	undo(tank){
		draw = function()
					{
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						game.main();
 						requestAnimationFrame(draw);
					};
	}

	getMessage(){
		return this.name;
	}

	draw(){
		ctx.lineWidth=1;
		ctx.strokeStyle=this.color;
		ctx.strokeRect(this.x,this.y,this.width,this.width);
	}

	onBulletHit(tank){
		
		this.maze.removePowerup(this);
		this.tank=tank;


		//Undo other powerups this tank has
		if(tank.powerup_timeout!=undefined){
			tank.undo_powerup();
			clearTimeout(tank.powerup_timeout);
		}
	
		//Set the timer
		this.timeout=setTimeout(function(){
			this.tank.remove_powerup(this); 
			this.timeout=undefined
		}.bind(this),game.powerup_duration/5*1000);

		this.effect(tank);
	}
}

class p_remove_bullet_limit extends Powerup {
	constructor(maze,x,y){
		super(maze,x,y);
		this.new=1;

		this.name = "remove bullet limit";
		this.color = "blue";
	}

	effect(tank){
		tank.shouldFire = function() 
		{
			if (this.shooting) {return true;}
			else {return false;}
		}		
	}

	undo(tank){
		tank.shouldFire=function(){
			if (this.shooting && this.bullets.length<this.bullet_limit) {return true;}
			else {return false;}
		}
	}

	getMessage(){
		return this.name;
	}

	draw(){
		ctx.lineWidth=1;
		ctx.strokeStyle=this.color;
		ctx.strokeRect(this.x,this.y,this.width,this.width);
	}

	onBulletHit(tank){
		
		this.maze.removePowerup(this);
		this.tank=tank;


		//Undo other powerups this tank has
		if(tank.powerup_timeout!=undefined){
			tank.undo_powerup();
			clearTimeout(tank.powerup_timeout);
		}
	
		//Set the timer
		tank.powerup_timeout=setTimeout(function(){tank.remove_powerup(this); tank.powerup_timeout=undefined},game.powerup_duration*1000);

		this.effect(tank);
	}
}

class p_triple_shot extends Powerup {
	constructor(maze,x,y){
		super(maze,x,y);
		this.new=1;

		this.name = "triple shot";
		this.color = "red";
	}

	effect(tank){
		//setting tank.old_fire=tank.fire caused an inf_recursion bug, so I just copied the defn
		tank.old_fire = function(rotation,speed)
		{
			var x_vel = speed*Math.sin(rotation);
			var y_vel = speed*-Math.cos(rotation);			//x,y _pos are at tip of the cannon
			var x_pos = this.x+this.width/2 + Math.sin(this.rotation)*this.height;
			var y_pos = this.y+this.height/2 + Math.cos(this.rotation)*-this.height;
			var new_bullet = new Bullet(this,[x_vel,y_vel],x_pos,y_pos);			
			this.bullets.push(new_bullet);
		}

		tank.fire = function(rotation, speed){
			this.old_fire(rotation, speed);
			this.old_fire(rotation-Math.PI/12, speed);
			this.old_fire(rotation+Math.PI/12, speed);
		}

		tank.bullet_limit=3*game.bullet_limit;
		
	}

	undo(tank){
		{
			this.fire = this.old_fire; 
			this.bullet_limit=game.bullet_limit;
		}	
	}

	getMessage(){
		return this.name;
	}

	draw(){
		ctx.lineWidth=1;
		ctx.strokeStyle=this.color;
		ctx.strokeRect(this.x,this.y,this.width,this.width);
	}

	onBulletHit(tank){
		
		this.maze.removePowerup(this);
		this.tank=tank;


		//Undo other powerups this tank has
		if(tank.powerup_timeout!=undefined){
			tank.undo_powerup();
			clearTimeout(tank.powerup_timeout);
		}
	
		//Set the timer
		tank.powerup_timeout=setTimeout(function(){tank.remove_powerup(this); tank.powerup_timeout=undefined},game.powerup_duration*1000);

		this.effect(tank);
	}
}
class p_move_through_walls extends Powerup {
	constructor(maze,x,y){
		super(maze,x,y);
		this.new=1;

		this.name = "move through walls";
		this.color = "blue";
	}

	effect(tank){
		//setting tank.old_fire=tank.fire caused an inf_recursion bug, so I just copied the defn
		
		tank.tryMovingTo=function(pos){
			var x = pos[0];
			var y = pos[1];

			if(!this.maze.isOutOfBounds([x,y])){
				this.x=x;
				this.y=y;
			}
		}

	

		
	}

	undo(tank){
		tank.tryMovingTo=function(pos){
				var x = pos[0];
				var y = pos[1];

				if(!this.maze.doesRectCollide([x,y,this.width,this.height])){
					this.x=x;
					this.y=y;
				}
		}
		var square = tank.maze.getSquareAtXY([tank.x,tank.y]);
		tank.x=square.getCenter()[0];
		tank.y=square.getCenter()[1];
	}

	getMessage(){
		return this.name;
	}

	draw(){
		ctx.lineWidth=1;
		ctx.strokeStyle=this.color;
		ctx.strokeRect(this.x,this.y,this.width,this.width);
	}

	onBulletHit(tank){
		
		this.maze.removePowerup(this);
		this.tank=tank;


		//Undo other powerups this tank has
		if(tank.powerup_timeout!=undefined){
			tank.undo_powerup();
			clearTimeout(tank.powerup_timeout);
		}
	
		//Set the timer
		this.timeout=setTimeout(function(){
			this.tank.remove_powerup(this); 
			this.timeout=undefined
		},game.powerup_duration*1000).bind(this);

		this.effect(tank);
	}
}

		