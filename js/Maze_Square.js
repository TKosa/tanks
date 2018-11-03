
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

		var mock_square=new Square(this,-1,-1); //Needed for visiting algorithm
		var ENTRY_SQUARE=maze.squares[0][0];
		this.visit(mock_square,ENTRY_SQUARE);
		
	}
	//Helper for randomize. 
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
	//checks if y-coordinate 
	getSquareAtXY(ar){
		if(x<0||y<0||x>this.width||y>this.height){throw "Tank outside of Maze Exception"}
		var x=ar[0];
		var y=ar[1];
		return this.squares[Math.floor(y/this.height * this.num_of_rows)][Math.floor(x/this.width * this.num_of_columns)]
	}

	getRandomXYLocation(){
		var rnd_row_num = Math.floor(Math.random()*this.squares.length);
		var row = this.squares[rnd_row_num];
		var rnd_square = row[Math.floor(Math.random()*row.length)];
		return rnd_square.getCenter();
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
		var w=this.width;
		var h=this.height;
		var wt=this.wall_thiccness;

		ctx.fillStyle=this.colour
		if(this.north)
		ctx.fillRect(this.x,this.y,w,wt);
		if(this.west)
		ctx.fillRect(this.x,this.y,wt,h);
		if(this.east)
		ctx.fillRect(this.x+w,this.y,wt,h);
		if(this.south)
		ctx.fillRect(this.x,this.y+h,w+wt,wt);
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


