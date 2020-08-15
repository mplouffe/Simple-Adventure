/* Simple Adventure Fight Engine
 * A simple rpg turn based fighting engine patterned after Dragon Warrior
 * Version: 0.2
 * Date Created: 07.01.2016
 * Last Updated: 15.01.2017
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial Build
 * 0.2 - Added comments so I could remember what the hell was going on
 */

/* USED BY ENGINE */

/* FIGHT STATE */
// Constructor
function FightState(section, canvas, enemy){

	// setting up variables
	this.stateName = "fight";				// name of the current state (used for logic in update method)
	this.waitingForPlayerInput = true;
	this.dialogPause;
	this.currentIconPosition = 4;
	this.playerInput;
	this.waitingForPlayerReading;
	this.blinkWait;
	this.readDelay = 0;
	this.numberOfBlinks = 0;
	this.blinkCounter = 0;
	
	// creating the fight interface
	fi = new FightInterface(section, canvas);
	// getting the playerBattler from the global player object
	let playerBattler = player.playerBattler;
	// setting the local enemyBattler reference from the enemy object passed in
	let enemyBattler = enemy;
	
	// setting up the spell array
	// TODO: right now it is just hard coded in, this needs to come from the global palyer object
	let spellArray = [new Spell("HURT", "damage", 10, 2), new Spell("HEAL", "heal", 10, 2)];
	// add the newly created spell array to the player battler object
	playerBattler.addSpells(spellArray);
	// TODO: this all seems weird. Can't the spells just be an array object already associated with the player global object?
	// (or whatever object we use to reference the player if changed from Global eventually)

	// set up the start of the fight dialog
	let fightStartText = ["A " + enemyBattler.name + " approaches!!!"];
	// create the start state passing in the start of fight dialog
	let startState = new ScrollTextState(fightStartText);
	// create the new fight state machine
	this.fightStateMachine = new StateStack(startState);
	// why does the state need a reference to it's own state machine? That seems broken
	// TODO: reconsider this
	// RECONSIDERED: I have the states manipulate the logic of the state machine
	// without the state doing the maniplation, the state machine would have to know way to much about the states
	startState.setStateStack(this.fightStateMachine);

	// create the new DM object passing in the playerBattler, enemyBattler, and fight state machine
	dm = new DungeonMaster(playerBattler, enemyBattler, this.fightStateMachine);
}

// Update
FightState.prototype.update = function(){
	// get the current state of the fightStateMachine
	let currentState = this.fightStateMachine.getCurrentState();
	// if the current state isn't null
	if(currentState != null)
	{
		// if the current state is 'fightwin' or 'runaway'
		if(currentState.stateName == "fightwin" || currentState.stateName == "runaway")
		{
			// pop this state off the stack
			stateMachine.popState(this);
		}
		// if the state is game over
		else if(currentState.stateName == "gameover")
		{
			// not sure if this state is currently reachable, definitely has not been tested
			stateMachine.popState(this);
			// not sure why I'm doing two pop states
			// seems a better idea would be to pop itself, then pass a message of game over up the stack to the 
			// next state to deal with it however it wants to
			let currentState = stateMachine.getCurrentState();
			if(currentState != null)
			{
				stateMachine.popState(currentState);
			}
		}
		// otherwise
		else
		{
			// update the fightStateMachine's current state
			this.fightStateMachine.currentState.update();
		}
	}
}

// Render
FightState.prototype.render = function(){
	// clear up the enemyWindowContext in the fightInterface
	fi.enemyWindowContext.clearRect(0, 0, canvas.width, canvas.height);

	// used for when the background is blinking due to the player being hit
	// blinkCounter counts the frames that the background should be on or off for
	if(fi.blinkPlayer){
		// if less than 8, just increase the blinkCounter (empty background)
		if(this.blinkCounter < 8)
		{
			this.blinkCounter++;
		}
		// if the blinkCounter is between 8 and 16 background is on and blinkCounter increases
		else if(this.blinkCounter < 16)
		{
			this.blinkCounter++;
			// consider refactoring this into it's own method cause I use it in three seperate places
			let enemyWindowBG = new Image();
			enemyWindowBG.src = 'imgs/fightWindowBackground.png';
			// I'm drawing the background and the enemy at some point so maybe combine all the draws into a single method or area?
			fi.enemyWindowContext.drawImage(enemyWindowBG, 0, 0);
		}
		// if the blinkCounter is over 16 check the number of times the blink has happened,
		// if it's less than 4, add to the numberOfBlinks and reset the blinkCounter
		else if(this.numberOfBlinks < 4)
		{
			this.blinkCounter = 0;
			this.numberOfBlinks++;
		}
		// if the background has already blinked four times:
		// turn off the blink player
		// turn on the background
		// reset the numberOfBlinks
		// reset the blinkCounter
		else
		{
			/* DRAWING BACKGROUND */
			let enemyWindowBG = new Image();
			enemyWindowBG.src = 'imgs/fightWindowBackground.png';
			fi.enemyWindowContext.drawImage(enemyWindowBG, 0, 0);
			/**********************/
			fi.blinkPlayer = false;
			this.blinkCounter = 0;
			this.numberOfBlinks = 0;
		}
	}
	// if the background is not blinking
	else
	{
	/* DRAWING BACKGROUND */
	let enemyWindowBG = new Image();
	enemyWindowBG.src = 'imgs/fightWindowBackground.png';
	fi.enemyWindowContext.drawImage(enemyWindowBG, 0, 0);
	/**********************/
	}
	// if the enemy is alive and and blinking (or blinking? why the or???)
	if(dm.enemy.isAlive || fi.blinkEnemy)
	{
		// if the enemy is blinking
		if(fi.blinkEnemy){
			// if the blinkCounter is at less than 8
			if(this.blinkCounter < 8)
			{
				// increase the blinkCounter (no enemy)
				this.blinkCounter++;
			}
			// if the blinkCounter is between 8 and 16 turn on the enemy and increase the blinkCounter
			else if(this.blinkCounter < 16)
			{
				this.blinkCounter++;
				/* Drawing the Enemy */
				let enemy = new Image();
				enemy.src = 'imgs/greenSlime.png';
				fi.enemyWindowContext.drawImage(enemy, 0, 0);
				/*********************/
			}
			// if the blinkCounter is over 16 check the number of blinks,
			// if it's less than 4, increase the number of blinks and reset the blinkCounter
			else if(this.numberOfBlinks < 4)
			{
				this.blinkCounter = 0;
				this.numberOfBlinks++;
			}
			// if the numberOfBlinks is over 4:
			// turn off the blinkEnemy
			// turn on the enemyImage
			// reset he blinkCounter
			// reset the numberOfBlinks
			else
			{
				/* Drawing the Enemy */
				let enemy = new Image();
				enemy.src = 'imgs/greenSlime.png';
				fi.enemyWindowContext.drawImage(enemy, 0, 0);
				/*********************/
				fi.blinkEnemy = false;
				this.blinkCounter = 0;
				this.numberOfBlinks = 0;
			}
		}
		// otherwise if the enemy isn't blinking
		else
		{
			/* Drawing the Enemy */
			let enemy = new Image();
			enemy.src = 'imgs/greenSlime.png';
			fi.enemyWindowContext.drawImage(enemy, 0, 0);
			/*********************/
		}
	}

	// check to make sure the fightStateMachine's currentState isn't null
	if(this.fightStateMachine.currentState != null)
	{
		// render the current fightStateMachine state
		this.fightStateMachine.currentState.render();
	}
}

// refresh
// Used when this state is re-loaded after a state above it on the stack is popped off
FightState.prototype.refresh = function() {

}

// removeState
// Used when this state is removed from the stack
FightState.prototype.removeState = function() {

}

// coverState
// Used when this state is covered by another state on the stack
FightState.prototype.coverState = function() {

}


/* Left Menu State */
// Constructor
function LeftMenuState(){
 	this.stateName = "leftMenuState";		// name of the state
 	this.menuDelay = 0;						// used to delay accepting user input after input (to prevent overly quick double choices)
 	this.menuOffset = 0;
 }

// setStateStack
// used to set a reference to the stateStack that the state lives in
LeftMenuState.prototype.setStateStack = function(stateStack){
	this.stateStack = stateStack;
}

// setMenuItemsArray
// sets the contents of the menuItemsArray into 
LeftMenuState.prototype.setMenuItemsArray = function(menuItemArray){
	fi.leftInputIcon.style.top = "4px";			// can't remember quite what this is for but related to the position of the menu cursor
	this.menuOffset = 0;						// again something to do with the positon of the menu cursor (I think offset) TODO: really need to figure out what this is for
	this.menuItems = menuItemArray;				// sets a reference to the menuItemArray passed in
}

// render
// render method for the inputMenu
LeftMenuState.prototype.render = function(){
	// make sure the display is set to block
	fi.leftInputDiv.style.display = "block";
	// clear out the innerHTML
	fi.leftInputP.innerHTML = "";
	// set the max for the amount of menuItems, either 5 or the number of items in the list
	let max = this.menuItems.length < 5 ? this.menuItems.length : 5;
	
	// for all the items in the menuItems list
	for(let i = 0; i < max; i++)
	{
		// write the content of the menuItem out to the inputMenu
		fi.leftInputP.innerHTML += this.menuItems[i + this.menuOffset].textTag;
		// as long as we're under 4
		if(i < 4)
		{
			// add a break to put the next input onto the next line
			fi.leftInputP.innerHTML += "<br>";
		}
	}
}

// update
// update method for the inputMenu
LeftMenuState.prototype.update = function(){
	// update the menuDelay value
	this.menuDelay++;
	// check the keys in the keysDown array
 	for(let key in keysDown){
 		// get the current position of the inputIcon
 		let currentIconPosition = parseInt(fi.leftInputIcon.style.top);
		// get the value of the current input key in the keysDown array
		let value = Number(key);
		
		// for moving up and down
		// if the key is the up key and currentIconPosition is greater than 4 and menuDelay is greater than 10
		if(value == 38 && currentIconPosition > 4 && this.menuDelay > 10)
		{
			// if the currentIconPosition is at the top (34) and the menuOffest if greater than 0
			if(currentIconPosition == 34 && this.menuOffset > 0)
			{
				// reset the delay
				this.menuDelay = 0;
				// subtract fromt the menuOffset
				this.menuOffset--;
			}
			// if the currentIconPosition isn't at the top yet
			else
			{
				// reset the menu delay
				this.menuDelay = 0;
				// move the currentIconPosition up one positon (30)
				currentIconPosition -= 30;
				// set the location of the inputIcon to the currentIconPosition
				fi.leftInputIcon.style.top = currentIconPosition + "px";
			}
		}
		// if the key is the down key and the menuDelay is greater than 10
		else if (value == 40 && this.menuDelay > 10)
		{
			// if the currentIconPositon is at the bottom (94) and the menuOffset is less than the max
			// (not sure how menuItems.length-5 = the max?)	
			if(currentIconPosition == 94 && this.menuOffset < this.menuItems.length - 5)
			{
				// reset the menuDelay
				this.menuDelay = 0;
				// increase the menuOffset
				this.menuOffset++;
			}
			// if the currentIconPosition isn't at the bottom yet
			else
			{
				// if the currentIconPosiiton is less than the menuItemsLengh and the currentIconPositon is less than 100
				if(((currentIconPosition - 4)/30) < this.menuItems.length && currentIconPosition < 100)
				{
					// reset the menuDelay
					this.menuDelay = 0;
					// increase the currentIconPosition by 30
					currentIconPosition += 30;
					// set the location of the inputIcont to the currentIconPosition
					fi.leftInputIcon.style.top = currentIconPosition + "px";
				}
			}
		}
		// if space pressed
		else if(value == 32 && this.menuDelay > 10)
		{
			// this is where I turn it off because I've made a choice with it.
			this.menuDelay = 0;
			// the pickedIndex is set to the currentIconPosition plus the menuOffset??
			// not sure why that equation equals the pickedIndex
			let pickedIndex = ((currentIconPosition - 4) / 30) + this.menuOffset;
			// calls picked on the pickedIndex
			this.menuItems[pickedIndex].picked(this);
		}
	}
 }

// refresh function
// just calls render
// used to render the menuState when required
LeftMenuState.prototype.refresh = function()
{
	this.render();
}

LeftMenuState.prototype.removeState = function() {

}

LeftMenuState.prototype.coverState = function() {

}


/* Right Menu State */
/* Check the Left Menu State for details on each method */
/* TODO: Consider combining the two menuStates into a more generic menu state that can be used for both */

// Constructor
function RightMenuState(){
	this.stateName = "rightmenustate";
 	this.menuDelay = 0;
 	this.menuOffset = 0;
}

RightMenuState.prototype.setStateStack = function(stateStack){
	this.stateStack = stateStack;
	fi.rightInputIcon.style.top = "4px";
	this.menuOffset = 0;
}

RightMenuState.prototype.setMenuItemsArray = function(menuItemArray){
	this.menuItems = menuItemArray;
	console.log("Menu Items Set: " + this.menuItems);
}

RightMenuState.prototype.update = function(){
 	this.menuDelay++;
 	for(let key in keysDown){
 		let currentIconPosition = parseInt(fi.rightInputIcon.style.top);
		let value = Number(key);
		// for moving up and down
		if(value == 38 && currentIconPosition > 4 && this.menuDelay > 10)
		{
			if(currentIconPosition == 34 && this.menuOffset > 0)
			{
				this.menuDelay = 0;
				this.menuOffset--;
			}
			else
			{
				this.menuDelay = 0;
				currentIconPosition -= 30;
				fi.rightInputIcon.style.top = currentIconPosition + "px";
			}
		}
		else if (value == 40 && this.menuDelay > 10){
			
			if(currentIconPosition == 94 && this.menuOffset < this.menuItems.length - 5)
			{
				this.menuDelay = 0;
				this.menuOffset++;
			}
			else
			{
				if(((currentIconPosition - 4)/30) < this.menuItems.length - 1 && currentIconPosition < 100)
				{
					this.menuDelay = 0;
					currentIconPosition += 30;
					fi.rightInputIcon.style.top = currentIconPosition + "px";
				}
			}
		}
		// if space pressed
		else if(value == 32 && this.menuDelay > 10)
		{
			console.log("picked");
			// this is where I turn it off because I've made a choice with it.
			this.menuDelay = 0;
			let pickedIndex = ((currentIconPosition - 4) / 30) + this.menuOffset;
			this.menuItems[pickedIndex].picked(this);
		}

		else if(value == 37 && this.menuDelay > 10)
		{
			fi.rightInputDiv.style.display = "none";
			this.stateStack.popState(this);
		}
	}
 }

RightMenuState.prototype.render = function(){
	fi.rightInputDiv.style.display = "block";
	fi.rightInputP.innerHTML = "";
	let max = this.menuItems.length < 5 ? this.menuItems.length : 5;

	for(let i = 0; i < max; i++)
	{
		fi.rightInputP.innerHTML += this.menuItems[i + this.menuOffset].textTag;

		if(i < 4)
		{
			fi.rightInputP.innerHTML += "<br>";
		}
	}
}

RightMenuState.prototype.refresh = function()
{
	this.render();
}

RightMenuState.prototype.removeState = function() {

}

RightMenuState.prototype.coverState = function() {
    
}


/* Text Boxes State*/
// Constructor
function ScrollTextState(textBoxArray){
	this.stateName = "scrolltextstate";				// state name
	this.menuDelay = 0;								// the delay after user inputs comman to prevent to fast choice selection
	this.textBoxArray = textBoxArray;				// the array of text boxes to be displayed in the text window
	this.textPrinted = false;						// boolean to check if the text is still printing out
	this.checkTextRoll();							// ???
}

// setStateStack
// sets a reference to the stateStack this scrollTextState exists in to the stateStack passed in
ScrollTextState.prototype.setStateStack = function(stateStack){
	this.stateStack = stateStack;
}

// checkTextRoll
// checks textBoxArray to see if there is still text that needs to be output to screen
ScrollTextState.prototype.checkTextRoll = function(){
	// set the blinkFlag to false
	fi.blinkFlag = false;
	// if there is still textBoxes in the array to be printed out
	if(this.textBoxArray.length > 0){
		// get the text to print out and pull it from the front of the array
		let currentText = this.textBoxArray.shift();
		// pass the text to be printed to the fi
		// also passes a reference to itself? can't remember why I neeeded to do that...
		fi.OutputTextToWindow(currentText, this);
	}
	// if there isn't any more text to output
	else
	{
		// pop this state off of the stack
		this.stateStack.popState(this);
		// updating the fight window UI
		// TODO: THIS TOTALLY SHOULDN'T BE IN HERE
		fi.fightWindowUIP.innerHTML = 'Health: ' + player.playerBattler.hitPoints + ' Mana: ' + player.playerBattler.magicPoints + ' Score: ' + player.score;
		// send control back to the dm for the next action
		dm.nextAction();
	}
}

// update
ScrollTextState.prototype.update = function(){
	// if the text is finished printing out to the screen
	if(this.textPrinted)
	{
		// increment the menuDelay variable
	 	this.menuDelay++;
	 	// for each key in the keysDown array
		for(let key in keysDown)
		{
			// get the numeric value of the key
			let value = Number(key);
			// if the key is the space key and the menuDelay has passed 10
			if(value == 32 && this.menuDelay > 10)
			{
				// reset menuDelay
				this.menuDelay = 0;
				// reset textPrinted
				this.textPrinted = false;
				// check to see if there is more text needed to print to the screen
				this.checkTextRoll();
			}
		}
	}
}

// render
// empty function
ScrollTextState.prototype.render = function(){}

// readyFoNextBox
// called to set the textPrinted variable to true when the fightInterfae has finished printing out the text
ScrollTextState.prototype.readyForNextBox = function(){
	this.textPrinted = true;
}

ScrollTextState.prototype.removeState = function() {

}

ScrollTextState.prototype.coverState = function() {
    
}


/* Fight Win State */
// only has the name of the state
// the logic is implemented by the update of the fight state
function FightWinState(){
	this.stateName = "fightwin";
}

// render
// empty function
FightWinState.prototype.render = function(){}

FightWinState.prototype.removeState = function() {

}

FightWinState.prototype.coverState = function() {
    
}

/* Game Over State */
// only has the name of the state
// the logic is implemented by the update of the fight state
function GameOverState(){
	this.stateName = "gameover";
}

// render
// empty function
GameOverState.prototype.render = function(){}

GameOverState.prototype.removeState = function() {

}

GameOverState.prototype.coverState = function() {
    
}
/* Run Away State */
// only has the name of the state
// the logic is implemented by the update of the fight state
function RunAwayState(){
	this.stateName = "runaway";
}
// render
// empty function
RunAwayState.prototype.render = function(){}

RunAwayState.prototype.removeState = function() {

}

RunAwayState.prototype.coverState = function() {
    
}