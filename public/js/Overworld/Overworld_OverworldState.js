/* Overworld_OverworldState
 * The OverWorld state for the Simple Adventure RPG engine.
 * Version: 0.2
 * Date Created: 06.27.2016
 * Last Update: 08.26.2016
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation
 * 0.2 - updating state housekeeping functions
 */


// UI
var playerScore;
var playerHealth;
var playerMana;
var ui;

// semi-global variables


// game variables
var playerColliders;
var nextLevel;
var levelBuilt;
var levelRndEncounterFactor;


/* setUp
 * - creates the canvas, sets up the animate, and starts the game loop
 */

function OverWorldState(section, canvas, player){
	// initialize some variables
    this.stateName = "overworld";
    this.needsRefresh = true;
	levelBuilt = false;
	currentLevelWalls = [];
	currentLevelDoors = [];
	currentLevelItems = [];
	keysDown = [];
	this.player = player;

	this.width = 820;
	this.height = 600;

    this.grid = new Grid(2, 2, 10, 10, 1, 1);

	// create the player
	playerColliders = [];

	// create the UI
	ui = document.createElement('p');
	
	ui.setAttribute('class', 'textAdventureUI');
	ui.setAttribute('id', 'overworldUI');
	ui.innerHTML = 'Health: ' + player.playerBattler.hitPoints +
			' Mana: ' + player.playerBattler.magicPoints +
			' Score: ' + player.score;

	this.canvas = canvas;
	this.canvas.width = owWidth;
	this.canvas.height = owHeight;
	// set the context
	context = this.canvas.getContext('2d');

	// attach the canvas to the window
	gameWindow.appendChild(ui);
}

/* update
 * calls update on all the game elements
 */
OverWorldState.prototype.update = function(){
	if(!levelBuilt){
		this.buildLevel(currentLevel);
		if(this.player.Object.x < 0)
		{
			this.player.Object.x = this.width - 10;
			this.player.Object.y = (this.height * 0.5) - 10;
		} else if(this.player.Object.x > this.width)
		{
			this.player.Object.x = 10;
			this.player.Object.y = (this.height * 0.5) - 10;
		} else if(this.player.Object.y < 0)
		{
			this.player.Object.x = (this.width * 0.5) - 10;
			this.player.Object.y = this.height - 10;
		} else if(this.player.Object.y > this.height)
		{
			this.player.Object.x = (this.width * 0.5) - 10;
			this.player.Object.y = 10;
		}
		levelBuilt = true;
	}
	this.player.Object.checkCollision(this.player, playerColliders);
    this.player.update();
    
    if (this.player.stepped)
    {
        currentLevelRndEncounterEngine.addSteps();
    }

	if(this.loadNextLevel())
	{
		levelBuilt = false;
		currentLevel = nextLevel;
	}
}

OverWorldState.prototype.loadNextLevel = function(){
	return this.player.Object.x + this.player.Object.width < 0 || this.player.Object.x > owWidth || this.player.Object.y + this.player.Object.height < 0 || this.player.Object.y > owHeight;
}

/* render
 * renders the new positions of all objects after the update
 */
OverWorldState.prototype.render = function(){

	context.fillStyle = "#3CF";
	context.fillRect(0, 0, this.width, this.height);

	for(var i = 0; i < currentLevelWalls.length; i++){
		currentLevelWalls[i].render();
	}
	for(var i = 0; i < currentLevelDoors.length; i++){
		currentLevelDoors[i].render();
	}
	for(var i = 0; i < currentLevelItems.length; i++){
		currentLevelItems[i].render();
    }
    
    context.moveTo(10, 20);
    context.lineTo(50, 40);

    this.grid.render();
    this.player.render();

}

OverWorldState.prototype.removeState = function()
{
	ui.parentElement.removeChild(ui);
}

OverWorldState.prototype.coverState = function()
{
    ui.parentElement.removeChild(ui);
}

/* BuildLevel
 * builds the level based on informaiton from the level xml file
 */
OverWorldState.prototype.buildLevel = function(levelNumber){
	
	currentLevelWalls = [];
	currentLevelDoors = [];
	currentLevelItems = [];
	playerColliders = [];

	// get an array of walls from the XML
	let walls = levels[levelNumber].getElementsByTagName('wall');

	// build the walls
	for(let i = 0; i < walls.length; i++)
	{
		let checkForDoor = walls[i].firstChild.nodeValue;
		let doorStatus = (checkForDoor.charAt(0) == 'D');
		if(doorStatus)
		{
			let doorNumber = parseInt(walls[i].getElementsByTagName('doorNumber')[0].firstChild.nodeValue);
			let exitTo = walls[i].getElementsByTagName('exitTo')[0].firstChild.nodeValue;
			let locked = walls[i].getElementsByTagName('locked')[0].firstChild.nodeValue;

			let key = null;
			if(locked == "true"){
				key = walls[i].getElementsByTagName('key')[0].firstChild.nodeValue;
				locked = true;
			}else{
				locked = false;
			}

			currentLevelDoors.push(new Door(directions[i], doorNumber, locked, key, '#FF80FF', exitTo));
			currentLevelWalls.push(new Wall(calculateWallX(directions[i], true), calculateWallY(directions[i], true), calculateWallWidth(directions[i], false), calculateWallHeight(directions[i], false), "#AAA"));
			currentLevelWalls.push(new Wall(calculateWallX(directions[i], false), calculateWallY(directions[i], false), calculateWallWidth(directions[i], false), calculateWallHeight(directions[i], false), "#AAA"));
			playerColliders.push(currentLevelDoors[currentLevelDoors.length - 1]);
			playerColliders.push(currentLevelWalls[currentLevelWalls.length - 2]);
			playerColliders.push(currentLevelWalls[currentLevelWalls.length - 1]);
		}
		else
		{
			currentLevelWalls.push(new Wall(calculateWallX(directions[i], true), calculateWallY(directions[i], true), calculateWallWidth(directions[i], true), calculateWallHeight(directions[i], true), "#AAA"));
			playerColliders.push(currentLevelWalls[currentLevelWalls.length - 1]);
		}
	}

	// build the items
	let itemStatus = levels[levelNumber].getElementsByTagName('items')[0].firstChild.nodeValue;
	if(itemStatus == "Y")
	{
		let item = levels[levelNumber].getElementsByTagName('item')[0];
		if(item != null)
		{
			let itemName = item.getElementsByTagName('itemName')[0].firstChild.nodeValue;
			let itemType = item.getElementsByTagName('itemType')[0].firstChild.nodeValue;
			let itemID = item.getElementsByTagName('itemID')[0].firstChild.nodeValue;
			let itemLocationX = parseInt(item.getElementsByTagName('itemLocationX')[0].firstChild.nodeValue);
			let itemLocationY = parseInt(item.getElementsByTagName('itemLocationY')[0].firstChild.nodeValue);

			currentLevelItems.push(new Item(itemLocationX, itemLocationY, itemType, itemName, itemID));
			playerColliders.push(currentLevelItems[currentLevelItems.length - 1]);
		}
	}

	// build the rndEncounterEngine
	currentLevelRndEncounterEngine = new RndEncounterEngine();
	let monsters = levels[levelNumber].getElementsByTagName('monsters');
	for(let i = 0; i < monsters.length; i++)
	{
		let monsterName = monsters[i].getElementsByTagName('monsterName')[0].firstChild.nodeValue;
		let monsterhp = monsters[i].getElementsByTagName('monsterhp')[0].firstChild.nodeValue;
		let monsterstrength = monsters[i].getElementsByTagName('monsterstrength')[0].firstChild.nodeValue;

		let newMonster = new Battler(monsterhp, 0, monsterstrength, 0, 0, 0, 7, monsterName);
		currentLevelRndEncounterEngine.addMonsterToList(newMonster);
	}

}

OverWorldState.prototype.refresh = function()
{
	ui = document.createElement('p');
	
	ui.setAttribute('class', 'textAdventureUI');
	ui.innerHTML = 'Health: ' + player.playerBattler.hitPoints +
			' Mana: ' + player.playerBattler.magicPoints +
			' Score: ' + player.score;

	this.canvas.setAttribute('class', 'overWorldWindow');
	this.canvas.width = owWidth;
	this.canvas.height = owHeight;
	// set the context
	context = this.canvas.getContext('2d');
	gameWindow.appendChild(ui);
	gameWindow.setAttribute('class', 'overWorldSection')
}