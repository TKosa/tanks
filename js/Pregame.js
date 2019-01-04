class Pregame
	{
	constructor(height)
		{
			//List of TankPanels
			this.start_panel=new StartPanel("red",this);
			this.tank_panels = [];
			this.height = canvas.height;
			this.width = canvas.width;
			this.focus = null;
			
		
			this.colour_templates = ["Lime","cyan","darkorange","Red","Green","#0000FF"];
			this.controls_templates = [
			["ArrowUp","ArrowRight","ArrowDown","ArrowLeft","1","2"]
			,["w","d","s","a","f","g"]
			,["y","j",'h','g','k','l']
			];

		}


	main()
		{
			this.draw();
		}


	draw()
		{
			this.start_panel.draw();
			this.tank_panels.forEach(function(tank_panel){tank_panel.draw();});
		}


	addTankPanel(tank_panel)
		{
			this.tank_panels.push(tank_panel);
			this.updatePanelHorizontals();
		}


	removeTankPanel(tank_panel)
		{
			this.tank_panels.splice(this.tank_panels.indexOf(tank_panel),1);
			this.updatePanelHorizontals();
		}


	updatePanelHorizontals()
		{
			//Set border width of start_panel
			if(this.tank_panels.length==0)
				{
				this.start_panel.east_border=PREGAME_BORDER_WIDTH;
				return;
				}
			this.start_panel.east_border=PREGAME_BORDER_WIDTH/2;
		
			//Set width and border widths of tank_panels
			var width = (canvas.width-this.start_panel.width)/(this.tank_panels.length); 
			for(var i=0;i<this.tank_panels.length;i++)
				{	
						var tank_panel = this.tank_panels[i];
					tank_panel.x=this.start_panel.width +(i)*width;
					tank_panel.width=width;
					tank_panel.buttons.forEach(function(b){b.update()});
					tank_panel.east_border=PREGAME_BORDER_WIDTH/2;
						
				}
			this.tank_panels[this.tank_panels.length-1].east_border=PREGAME_BORDER_WIDTH;
		
		}



	//Look through all elements to see if any of them were at the click location
	onclick(x,y)
		{
			var all_panels = this.tank_panels.concat([this.start_panel]);
			all_panels.forEach(function(tank_panel)
				{
				tank_panel.buttons.forEach(function(button)
					{
				
						if(doRectsOverlap([x,y,1,1],button.get_as_Rect()))
							{
							button.onclick();
							return;
							}
					});
				});
		}


	keyDownHandler(e)
		{

			if(this.focus==null){return;}
			this.focus.keyDownHandler(e);
		}	
	}	


//Panel to change controls
class Panel
	{
	constructor(colour)
		{
		this.width = canvas.width/5; //this gets overwritten right away by the calling code, so initial value doesn't matter
		this.height = canvas.height;
		this.x=0;
		this.y=0;
		this.colour = colour;
		this.buttons=[];

		this.north_border=PREGAME_BORDER_WIDTH;
		this.east_border=PREGAME_BORDER_WIDTH/2;
		this.south_border=PREGAME_BORDER_WIDTH;
		this.west_border=PREGAME_BORDER_WIDTH/2;
		}


	addButton(button)
		{
		this.buttons.push(button);
		}


	draw()
		{

		ctx.fillStyle = "black";
		ctx.fillRect(this.x,this.y,this.width,this.height);

		ctx.fillStyle = this.colour;
		ctx.fillRect(this.x+this.west_border, this.y+this.north_border,this.width-this.west_border-this.east_border,this.height-this.north_border-this.south_border);

		
		this.buttons.forEach(function(b){b.draw()});	
		}
	}


class StartPanel extends Panel 
 	{
 	constructor(colour,pregame)
  		{
	 	super(colour);
		this.pregame=pregame;
		this.west_border=PREGAME_BORDER_WIDTH;
		this.east_border=PREGAME_BORDER_WIDTH;

		var start_button = new Button(this,0,0,"Start");
		start_button.onclick = this.start.bind(this.pregame);
		start_button.center_horizontally();	
		start_button.y = canvas.height * 9/20;
		this.addButton(start_button);

		var add_button = new Button(this,0,0,"Add Tank");
		add_button.onclick = function()
			{
			var pregame=this.panel.pregame;
			var current_template = pregame.tank_panels.length;
			pregame.addTankPanel(new TankPanel(pregame.colour_templates[current_template],pregame.controls_templates[current_template]));
			};
		add_button.y=canvas.height * 11/20;
		add_button.center_horizontally();
		this.addButton(add_button);
	  	}

	//Starts the game by making a maze and populating it with tanks based on tank_panel attributes
 	start()
	 	{
		var maze = new Maze(5,7,canvas.width,canvas.height*4/5,wall_thiccness);
		main_object = maze;

		//Instantiate tanks from the input in the panels 
		for(var i=0;i<this.tank_panels.length;i++)
			{
			var panel = this.tank_panels[i];
			var cb = panel.buttons;
			var controls = [cb[1].key, cb[2].key, cb[3].key, cb[4].key, cb[5].key, cb[6].key];
			var rnd_pos = maze.getRandomSquare().getCenter();
			
			var tank = new Tank (0,0,maze,controls,panel.colour);
			maze.placeObject(tank);
			}
		}
	}


class Button
	{
	constructor(panel,x,y,text="")
		{
		this.height = 20;
		this.width=panel.width/1.5;
		this.y=y;
		this.text=text;
		this.panel=panel;
		}

	get_as_Rect()
		{
		return [this.x,this.y,this.width,this.height];
		}
	
	//Called when a new panel is added, and things need to get resized
	update()
		{
		this.width=this.panel.width/1.5;
		this.x=this.panel.x+this.panel.width/2-this.width/2;
		}
	
	draw()
		{
		ctx.fillStyle = "white";
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.font = "10px Arial";
		ctx.fillText(this.text,this.x+this.width/2,this.y+this.height/1.5);
		}

	center_horizontally()
		{
		this.width=this.panel.width/2;
		this.x=this.panel.x+this.panel.width/2-this.width/2;
		}

	center_vertically()
		{
		this.y=this.panel.y+this.panel.height/2-this.height/2;
		}
	}


class TankPanel extends Panel 
	{
	constructor(colour="green",assignment=undefined)
		{
		super(colour);
		var delete_button = new Button(this,0,this.height/12,"delete");
		delete_button.onclick = function()
			{
			var index = pregame.panels.indexOf(this);
			pregame.panels.splice(index,1);
			pregame.updatePanelHorizontals();
			}
		this.addButton(delete_button);
		delete_button.center_horizontally();


		var controls = ["up","right","down","left","attack","special"];
		for (var i=0;i<controls.length;i++)
			{
			var button = new setControlsButton(this,0,this.height*(3+i)/12,controls[i],assignment ? assignment[i] : undefined);
			button.center_horizontally();
			this.addButton(button);
			}
		}
	}


class setControlsButton extends Button 
	{
	constructor(panel,x,y,text,key=undefined)
		{
		super(panel,x,y,text+":");
		this.control=text+": "; //e.g. "attack"
		this.key = key; //e.g. spacebar	
		}

	keyDownHandler(key)
		{
		 this.key=key;
		 this.text = this.control + key;
		}

	onclick()
		{
		pregame.focus = this;
		}
	
	draw()
		{

		if(pregame.focus == this)
			{
			ctx.fillStyle = "red";
			ctx.fillRect(this.x,this.y,this.width,this.height);	
			}

		else
			{
			ctx.fillStyle = "white";
			ctx.fillRect(this.x,this.y,this.width,this.height);	
			}

		ctx.fillStyle = "white";
		ctx.fillRect(this.x+2,this.y+2,this.width-4,this.height-4);
			
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.font = "10px Arial";
		ctx.fillText(this.key ? this.control + this.key : this.control ,this.x+this.width/2,this.y+this.height/1.5);	

		}
	}
