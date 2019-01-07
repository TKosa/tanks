
//Settings
var num_of_rows = 6;
var num_of_columns = 7; 
var wall_thiccness=4;
var MOVE_SPEED=3;
var ROTATION_SPEED=9/100;
var BULLET_SPEED=3;
var PREGAME_BORDER_WIDTH = 5;
var SECONDS_BETWEEN_ROUNDS = 3;
var FRIENDLY_FIRE = false;
var BULLET_LIMIT =7 ;
var BOUNCE_LIMIT = 7;
var POWERUP_INTERVAL = 2000;
var POWERUP_LIMIT = 3;
var POWERUP_DURATION = 10000;

class Game{
	constructor()
		{
			this.num_of_rows = 6;
			this.num_of_columns = 9; 
			this.wall_thiccness=4;
			this.speed=1;
			this.move_speed=3;
			this.rotation_speed=9;
			this.bullet_speed=3;
			this.pregame_border_width = 5;
			this.seconds_between_rounds = 3;
			this.friendly_fire = false;
			this.bullet_limit =7 ;
			this.bounce_limit = 7;
			this.powerup_interval = 5;
			this.powerup_limit = 7;
			this.powerup_duration = 10;

			this.pregame=new Pregame(this,canvas.height*3/4);
			this.main_object=this.pregame;
		}
	main(){this.main_object.main();}
	onclick(x,y){this.main_object.onclick(x,y)}
	keyDownHandler(key){this.main_object.keyDownHandler(key);}

	



};

class Setting {

}




//Global variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var game = new Game();


function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game.main();
 	requestAnimationFrame(draw);
};


function setup(){

	canvas.addEventListener('click', function(event) 
		{
	   
	    	var x = event.pageX - canvas.offsetLeft;
	       	var y = event.pageY - canvas.offsetTop;
			game.onclick(x,y);
			
		}, false);

	addEventListener("keydown",function(event)
		{
			
				game.keyDownHandler(event.key);
			
		
		},false);

	draw();
};



setup();
