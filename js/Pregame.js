class Pregame
	{
	constructor(game,height)
		{
			this.game=game;

			//List of TankPanels
			this.start_panel=new StartPanel("red",this);
			this.tank_panels = [];
			this.height = canvas.height;
			this.width = canvas.width;
			this.focus = null;
			this.settings = new SettingsPanel(this);
			this.current_panels = [this.start_panel].concat(this.tank_panels);
			
		
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
			this.current_panels.forEach(function(tank_panel){tank_panel.draw();});
		}



	addTankPanel(tank_panel)
		{
			this.tank_panels.push(tank_panel);
			this.current_panels = [this.start_panel].concat(this.tank_panels);
			this.updatePanelHorizontals();
		}


	removeTankPanel(tank_panel)
		{
		
			this.tank_panels.splice(this.tank_panels.indexOf(tank_panel),1);
			this.current_panels = [this.start_panel].concat(this.tank_panels);
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
			this.found_button=false; //local var to stop looking if we found our button
			this.current_panels.forEach(function(panel)
				{
				if(!this.found_button)
				panel.buttons.forEach(function(button)
					{
						if(!this.found_button)
						if(doRectsOverlap([x,y,1,1],button.get_as_Rect()))
							{
						
							this.found_button=true;
							button.onclick();
							}
					}.bind(this));
				}.bind(this));
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
			pregame.addTankPanel(new TankPanel(pregame,pregame.colour_templates[current_template],pregame.controls_templates[current_template]));
			};
		add_button.y=canvas.height * 11/20;
		add_button.center_horizontally();
		this.addButton(add_button);

		var settings_button = new Button(this,0,0,"Settings");
		settings_button.onclick = function()
			{
				this.pregame.current_panels=[this.pregame.settings];
			}.bind(this);
		settings_button.y=canvas.height * 13/20;
		settings_button.center_horizontally();
		this.addButton(settings_button);
	  	}




	//Starts the game by making a maze and populating it with tanks based on tank_panel attributes
 	start()
	 	{

		var maze = new Maze(this.game);
		this.game.main_object=maze;

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
		this.x=0;
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
		this.resize_horiontals();
		}
	resize_horiontals()
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
	constructor(pregame,colour="green",assignment=undefined)
		{
		super(colour);
	
		this.pregame=pregame;
		var delete_button = new Button(this,0,this.height/12,"delete");
		delete_button.onclick = function()
			{
			this.pregame.removeTankPanel(this);
			}.bind(this);
		this.addButton(delete_button);
		delete_button.center_horizontally();


		var controls = ["up","right","down","left","attack","special"];
		for (var i=0;i<controls.length;i++)
			{
			var button = new SetControlsButton(this,0,this.height*(3+i)/12,controls[i],assignment ? assignment[i] : undefined);
			button.center_horizontally();
			
			}
		}
	}


class SetControlsButton extends Button 
	{
	constructor(panel,x,y,text,default_key="")
		{
 		super(panel,x,y,text+":");
		this.control=text+": "; //e.g. "attack"
		this.key = default_key; //e.g. spacebar	
		this.panel.addButton(this);
		}

	keyDownHandler(key)
		{
		this.key=key;
		this.text = this.control + key;
		}

	onclick()
		{
		this.panel.pregame.focus = this;
		}
	
	draw()
		{

		if(this.panel.pregame.focus == this)
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
		ctx.fillText(this.key ? (this.control + this.key).toString() : this.control.toString() ,this.x+this.width/2,this.y+this.height/1.5);	

		}
	}

class SetSettingsButton extends SetControlsButton {

	keyDownHandler(key){
		this.key+=key;
	}

}

class SettingsPanel extends Panel{

	constructor(pregame)
		{
			super("Green");
			this.width=canvas.width;
			this.pregame=pregame;

			//back button
			var back = new Button(this,0,0,"Back");this.back=back;
			back.y=canvas.height*5/6;
			back.update();
			back.onclick = function(){
				var save_successful = this.save();
				if (!save_successful){return;}
				this.pregame.current_panels = [this.pregame.start_panel].concat(this.pregame.tank_panels);
			}.bind(this);
			this.addButton(back);

		
			//Create settings buttons
			this.settings = [
			 ["Number of Rows","num_of_rows"]
			,["Number of Columns","num_of_columns"]
			,["Movement Speed","move_speed"]
			,["Friendly Fire","friendly_fire"]
			,["Number of Bullets","bullet_limit"]
			,["Time Between Powerups (s)","powerup_interval"]
			,["Max powerups on screen","powerup_limit"]
			,["Duration of powerups (s)","powerup_duration"]
			];
			this.settings.forEach(function(ar){this.make_button(ar)}.bind(this));
		

			//Position the buttons on the screen
			var blen = this.buttons.length;
			for(var i=1;i<blen;i++)
				{
					var button = this.buttons[i];
					button.y = canvas.height*4/5/(blen-1)*(i-1)+button.height;
					button.resize_horiontals();

				}
		}

	save()
		{
			return true;


		}
	isPosInt(x){
		if(isNaN(x)){return false;}
		if(!Number.isInteger(x) || x<0){return false;}
		return true;
	}
	make_button(ar)
		{	
			//Make button a property of SettingsPanel and set its keydown and onclick
			var text = ar[0];
			var attribute_name = ar[1];
			this[attribute_name]=new SetSettingsButton(this,0,0,text);
			this[attribute_name].key=this.pregame.game[attribute_name].toString();
			this[attribute_name].onclick = function(){
				this.panel.pregame.focus=this;
			};
			this[attribute_name].keyDownHandler = function(key){
				if(key=="Backspace"){this.key=this.key.slice(0,-1);return};
				if(key=="Enter"){this.key="";return}
				this.key+=key;
			}

			//Corner case for friendly fire button 
			if(ar[0]=="Friendly Fire")
			{
				this[attribute_name].onclick = function(){this.key= this.key ? false:true}
			}
		}



	
}