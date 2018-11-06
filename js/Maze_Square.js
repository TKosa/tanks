
//ctx must be defined 


class Maze {
	constructor(num_of_rows,num_of_columns,width,height,wall_thiccness){
		this.num_of_rows=num_of_rows;
		this.num_of_columns=num_of_columns;
		this.width=width-wall_thiccness;
		this.height=height-wall_thiccness;
		this.wall_thiccness=wall_thiccness;
		this.tanks=[];

		var squares=[];
		for(var r=0;r<num_of_rows;r++){
			var row=[];
			for (var c=0;c<num_of_columns;c++){
				row.push(new Square(this,r,c));
			}
			squares.push(row);
		}
		this.squares=squares;
	}
	draw(){
		ctx.fillStyle="black";
		this.squares.forEach(function(element){
			element.forEach(function(e){
				e.draw();
			});
		});
		this.tanks.forEach(function(e){
			e.draw();
		})
	}
	randomize(){
		this.squares.forEach(function(element){
			element.forEach(function(e){
				e.visited=false;
			});
		});

		var entry_square=this.squares[0][0];
		this.visit(new Square(this,-1,-1),this.getRandomSquare());
		
	}
	
	//Used in randomize. Visiting square b from a means removing the border between a-b and visiting all unvisited neighbours (in a random order). 
	visit(old_square,new_square){
		old_square.removeBorder(new_square);
		new_square.visited=true;

		var neighbours=new_square.getNeighbours();
		neighbours=shuffle(neighbours);

		for(var i=0;i<neighbours.length;i++){
			if (neighbours[i].visited==false){
				this.visit(new_square,neighbours[i]);
			}
		}
	}
	
	getSquareAtXY(pos){
		if(x<0||y<0||x>this.width||y>this.height){return -1;}
		var x=pos[0];
		var y=pos[1];
		return this.squares[Math.floor(y/this.height * this.num_of_rows)][Math.floor(x/this.width * this.num_of_columns)]
	}

	getRandomSquare(){
		var rnd_row_num = Math.floor(Math.random()*this.squares.length);
		var row = this.squares[rnd_row_num];
		var rnd_square = row[Math.floor(Math.random()*row.length)];
		return rnd_square;
	}
	
	
	//Check if a rectangle collides with (a wall in) the maze
	doesRectCollide(rect){
		var square = this.getSquareAtXY([rect[0],rect[1]]);
		var nearby_squares = square.getNeighbours().concat([square]);
		var nearby_walls = [];
		nearby_squares.forEach(function(e){
			e.getWalls().forEach(function(el){
				nearby_walls.push(el);
			});
		});
		var collides=false;
		nearby_walls.forEach(function(e){
			if(doRectsOverlap(rect,e)){collides=true;}
		})
		return collides;

	}
}
	

	

class Square {
	constructor(maze,row,col){
		this.maze=maze;
		this.row=row;
		this.col=col;
		this.north=true;
		this.east=true;
		this.south=true;
		this.west=true;
		this.colour="black";
		
	
		this.width=maze.width/maze.num_of_columns;
		this.height=maze.height/maze.num_of_rows;
		this.wall_thiccness=maze.wall_thiccness;

		//top left corner
		this.x=this.col*this.width;
		this.y=this.row*this.height;
	}
	draw(){
		//local aliases for legibility
		ctx.fillStyle=this.colour;
		this.getWalls().forEach(function(e){
			ctx.fillRect(e[0],e[1],e[2],e[3]);
		});

		
	}
	removeBorder(square){
		if(this.row==square.row){
			if(this.col==square.col-1){
				this.east=false;
				square.west=false;
			}
			if(this.col==square.col+1){
				this.west=false;
				square.east=false;
			}
		}
		if(this.col==square.col){
			
			if(this.row==square.row-1){
				this.south=false;
				square.north=false;
			}
			if(this.row==square.row+1){
				this.north=false;
				square.south=false;
			}

		}
	}
	//Returns neighbouring squares
	getNeighbours(){	
		var neighbours=[]
		if(this.col>0){neighbours.push(this.maze.squares[this.row][this.col-1]);}
		if(this.col<this.maze.num_of_columns-1){neighbours.push(this.maze.squares[this.row][this.col+1]);}
		if(this.row>0){neighbours.push(this.maze.squares[this.row-1][this.col]);}
		if(this.row<this.maze.num_of_rows-1){neighbours.push(this.maze.squares[this.row+1][this.col]);}

		return neighbours;
	}
	//returns [x,y]
	getCenter(){
		return [ (this.col+1/2)*this.width , (this.row+1/2)*this.height ]
	}
	//returns list of walls (rectangles [x,y,width,height])
	getWalls(){
		var w=this.width;
		var h=this.height;
		var wt=this.wall_thiccness;

		var walls=[];
		if (this.north)walls.push([this.x,this.y,this.width,this.wall_thiccness]);
		if (this.west) walls.push([this.x,this.y,wt,h]);
		if(this.east)  walls.push([this.x+w,this.y,wt,h]);
		if(this.south) walls.push([this.x,this.y+h,w+wt,wt]);

		return walls;
	}
}

//Helper Fns
var shuffle=function(array){

				var tmp=[];
				while(array.length>0){
					var rnd=Math.floor(Math.random()*array.length);
					tmp.push(array[rnd]);
					array.splice(rnd,1);			
				}
				return tmp;
			}


