
//Settings
var num_of_rows = 6;
var num_of_columns = 7; 
var wall_thiccness=4;
var MOVE_SPEED=3;
var ROTATION_SPEED=9/100;
var BULLET_SPEED=3;


//Global variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var maze = new Maze(num_of_rows,num_of_columns,canvas.width,canvas.height,wall_thiccness);



function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	maze.draw();
	
 	requestAnimationFrame(draw);
};


function main(){

maze.randomize();

t =new Tank(20,20,maze,["w","d","s","a","x","z"],"blue");
t2=new Tank(20,20,maze,["ArrowUp","ArrowRight","ArrowDown","ArrowLeft","n","m"],"green");

var tank_img = document.getElementById("tank");
t.loadImage(tank_img);

draw();
};
main();
