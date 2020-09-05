/* GridWorld_OverworldState
 * The Overworld state for the Simple Adventure RPG engine.
 * Version: 0.3
 * Date Created: 06.27.2016
 * Last Update: 09.01.2020
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation
 * 0.2 - updating state housekeeping functions
 * 0.3 - changing over to use a grid based world
 */


// UI
var playerScore;
var playerHealth;
var playerMana;
var ui;

// semi-global variables


// game variables
var playerColliders;
var nextRoom;
var roomBuilt;
var levelRndEncounterFactor;


/* setUp
 * - creates the canvas, sets up the animate, and starts the game loop
 */

function OverWorldState(gfxEngine, inputEngine, player){
    this.gfxRef = gfxEngine;
    this.inputRef = inputEngine;
    this.playerRef = player;

    this.directions = ['N', 'E', 'S', 'W'];
	
    this.level = loadJSON("json/levelData.json");
    this.currentRoom = 0;
    this.nextRoom = 0;

    // TODO: change these hardcoded values to read from the level
    // (will allow for changeable room sizes)
	this.gfxRef.canvas.width = 820;
    this.gfxRef.canvas.height = 600;
    this.movementGrid = new Grid(41, 30, 20, 20, 1, 1);

    this.playerRef.setMovementGrid(this.movementGrid);

	// initialize some variables
    this.stateName = "overworld";
    this.needsRefresh = true;
	this.roomBuilt = false;
	this.currentRoomGrid = [[]];
	this.inputRef.keysDown = [];

	// create the UI
	this.gfxRef.ui.setAttribute('class', 'textAdventureUI');
	this.gfxRef.ui.setAttribute('id', 'overworldUI');
	this.gfxRef.ui.innerHTML = 'Health: ' + this.playerRef.playerBattler.hitPoints +
			' Mana: ' + this.playerRef.playerBattler.magicPoints +
			' Score: ' + this.playerRef.score;
    

}

/* update
 * calls update on all the game elements
 */
OverWorldState.prototype.update = function(){
	if(!this.roomBuilt){
		this.buildRoom(this.currentRoom);
		// if(this.player.Object.x < 0)
		// {
		// 	this.player.Object.x = this.width - 10;
		// 	this.player.Object.y = (this.height * 0.5) - 10;
		// } else if(this.player.Object.x > this.width)
		// {
		// 	this.player.Object.x = 10;
		// 	this.player.Object.y = (this.height * 0.5) - 10;
		// } else if(this.player.Object.y < 0)
		// {
		// 	this.player.Object.x = (this.width * 0.5) - 10;
		// 	this.player.Object.y = this.height - 10;
		// } else if(this.player.Object.y > this.height)
		// {
		// 	this.player.Object.x = (this.width * 0.5) - 10;
		// 	this.player.Object.y = 10;
		// }
		this.roomBuilt = true;
	}
	this.playerRef.playerObject.checkCollision(this.playerRef, playerColliders);
    this.playerRef.update(this.inputRef);
    
    if (this.playerRef.stepped)
    {
        this.currentLevelRndEncounterEngine.addSteps();
    }

	if(this.loadNextLevel())
	{
		this.roomBuilt = false;
		this.currentRoom = this.nextRoom;
	}
}

OverWorldState.prototype.loadNextLevel = function(){
	//return this.player.Object.x + this.player.Object.width < 0 || this.player.Object.x > owWidth || this.player.Object.y + this.player.Object.height < 0 || this.player.Object.y > owHeight;
    return false;
}

/* render
 * renders the new positions of all objects after the update
 */
OverWorldState.prototype.render = function(){

	this.gfxRef.context.fillStyle = "#3CF";
	this.gfxRef.context.fillRect(0, 0, this.width, this.height);

    this.playerRef.render(this.gfxRef.context);
}

OverWorldState.prototype.removeState = function()
{
	this.gfxRef.ui.parentElement.removeChild(this.gfxRef.ui);
}

OverWorldState.prototype.coverState = function()
{
    this.gfxRef.ui.parentElement.removeChild(this.gfxRef.ui);
}

/* BuildLevel
 * builds the level based on informaiton from the level xml file
 */
OverWorldState.prototype.buildRoom = function(levelNumber){
    // TODO: All this logic again
    // *le sigh* :/
}

OverWorldState.prototype.refresh = function()
{
    if (typeof this.gfxRef.ui === 'undefined')
    {
        this.gfxRef.ui = document.createElement('p');
    }
	
	this.gfxRef.ui.setAttribute('class', 'textAdventureUI');
	this.gfxRef.ui.innerHTML = 'Health: ' + this.playerRef.playerBattler.hitPoints +
			' Mana: ' + this.playerRef.playerBattler.magicPoints +
			' Score: ' + this.playerRef.score;

	this.gfxRef.canvas.setAttribute('class', 'overWorldWindow');
	this.gfxRef.canvas.width = owWidth;
	this.gfxRef.canvas.height = owHeight;
	this.gfxRef.gameWindow.appendChild(ui);
	this.gfxRef.gameWindow.setAttribute('class', 'overWorldSection')
}