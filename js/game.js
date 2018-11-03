
//Settings
var num_of_rows = 6;
var num_of_columns = 7; 
var wall_thiccness=10;
//Settings

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//var maze = make_maze(num_of_rows,num_of_columns,canvas.width,canvas.height);





var maze = new Maze(num_of_rows,num_of_columns,canvas.width,canvas.height,wall_thiccness);


function draw(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	maze.draw();

 	requestAnimationFrame(draw);
};


function main(){
s0=maze.squares[0][0];
s1=maze.squares[0][1];
maze.randomize();
t =new Tank(20,20,maze,["w","d","s","a","x","z"],"blue");
t2=new Tank(20,20,maze,["ArrowUp","ArrowRight","ArrowDown","ArrowLeft","x","z"],"green");

draw();


};
main();
//Takes 2d array maze from make_maze() in helper_fns.js 

		document.addEventListener("keydown", this.keyDownHandler, false);


/* 

*/
