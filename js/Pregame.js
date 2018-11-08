class Pregame{

	constructor(){
		//List of TankPanels
		//addTankPanel.buttons[0].onclick = function(){pregame.addTP("red");}; 

		this.TPs = [];
		this.active=true;

		this.addTP("red");
		var add_button = this.TPs[0].buttons[0];
		add_button.onclick = function(){pregame.addTP("green");};
		add_button.y=add_button.TP.height/2-add_button.height/2;
		add_button.text="Add Tank";

		
	}

	draw(){
		this.TPs.forEach(function(TP){
			TP.draw();
		});

	}

	addTP(colour){
		this.TPs.splice(this.TPs.length-1, 0, new TankPanel(colour));
		this.updateTPHorizontals();
		
	}

	removeTP(tp){
		this.TPs.splice(this.TPs.indexOf(tp),1);
		this.updateTPHorizontals();
	}

	updateTPHorizontals(){
		var len = this.TPs.length;
		var width = canvas.width/len; 
		for(var i=0;i<len;i++){
			var ref = this.TPs[i];
			ref.x=i*width;
			ref.width=width;
			ref.button.update();
			
		}

	}
	onclick(x,y){
		this.TPs.forEach(function(TP){
			TP.buttons.forEach(function(button){
					if(doRectsOverlap([x,y,1,1],button.getRect())){
						button.onclick();
						return;
			}
			});
		});
	}
}

//Panel to change controls
class TankPanel{

	constructor(colour){
		console.log(this.pregame);
		this.width = 0;
		this.x=0;
		this.height = canvas.height;
		this.colour = colour;
		var deleteButton = new Button(this,this.x+this.width/2-this.width/4,10,function(){pregame.removeTP(this)}.bind(this),"Delete Tank")
		this.buttons = [deleteButton];
		this.lineWidth=5;

	}


	draw(){
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.x,0,this.width,this.height);

		ctx.strokeStyle = "black";
		ctx.lineWidth=this.lineWidth;
		
		ctx.strokeRect(this.x,0,this.width-3,this.height)
		this.buttons.forEach(function(b){b.draw()});
		
	}

	addButton(x,y,onclick){
		this.buttons.push(new Button(this,x,y,onclick));
	}

}

class Button{
	constructor(TP,x,y,onclick=function(){},text=""){
		this.TP=TP;
		TP.button=this;

		this.width = TP.width/2;
		this.height = 20;
		this.x=x;
		this.y=y;
		this.text=text;

		this.onclick=onclick;
	}
	
	getRect(){
		return [this.x,this.y,this.width,this.height];
	}
	//Called when a new TP is added, and things need to get resized
	update(){
		this.width=this.TP.width/2;
		this.x=this.TP.x+this.TP.width/2-this.width/2;
	}
	draw(){
		ctx.fillStyle = "white";
		this.strokeStle = this.TP.colour;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.font = "10px Arial";
		ctx.fillText(this.text,this.x+this.width/2,this.y+this.height/1.5);

	}
}