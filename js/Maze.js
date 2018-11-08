
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

		this.randomize();
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
		var x=pos[0];
		var y=pos[1];
		//Check if position is in the maze
		if(this.isOutOfBounds(pos)){return false;}
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
		if(this.isOutOfBounds(rect[0],rect[1])){return true;}
		var square = this.getSquareAtXY([rect[0],rect[1]]);
		if(!square){return true;}
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
	isOutOfBounds(pos){
		if(pos[0]<=0 || pos[0]>=this.width || pos[1]<=0 || pos[1]>=this.height){return true;}
		return false;
	}
}
	

	

