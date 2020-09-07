/* Simple Adventure Level Generation System
 * Generates a level for Simple Adventure Game based on XML data.
 * Version: 0.1
 * Date Created: 06.30.2016
 * Last Update: 07.01.2016
 * Author: Matheu Plouffe
 */

/* WALL OBJECTS
 */
function Wall(x, y, height, width, color){	
	this.Object = new Object(x, y, height, width, color);
	this.tag = "solid";
}

/* Wall Renderer
 * uses the wall object's render function
 */
Wall.prototype.render = function(){
	this.Object.render();
}

/* DOOR
 * Creates a door object
 * uses the direction input to calculate it's X and Y values
 * handles it's own locked nature and holds the value of the key that will unlock it if needed
 */
function Door(direction, doorNumber, locked, key, color, exitTo){
	this.Object = new Object(calculateDoorX(direction), calculateDoorY(direction), calculateDoorWidth(direction), calculateDoorHeight(direction), color);
	this.doorNumber = doorNumber;
	this.locked = locked;
	this.key = key;
	this.exitTo = exitTo;
	this.tag = "door";
}

/* Door Renderer
 * simply creates a square for a door if the door is locked
 */
Door.prototype.render = function(){
	if(this.locked){
		this.Object.render();
	}
}

/* Door Collision
 * when the player collides with a door
 * handles repulsing the player if the door is locked
 * loads the value of the next level to load into the game engine
 */
Door.prototype.checkLock = function(){
	
	if(this.locked)
	{
		return true;
	} else if(!this.locked)
	{
		nextLevel = this.exitTo;
		return false;
	}
}

/* ITEM OBJECTS
 * Creates an Item object.
 *
 */
function Item(x, y, itemType, itemName, itemID)
{
 	let itemColor = "#F0F0F0";

 	// set the color of the item based on the itemType
 	switch(itemType)
 	{
 		case 'key':
 			itemColor = '#FF80FF';
 			break;
 	}

 	this.Object = new Object(x, y, 20, 20, itemColor);
 	this.itemType = itemType;
 	this.itemName = itemName;
 	this.itemID = itemID;
 	this.tag = 'item';
}

/* getItem
 * the point of this is to pick up the item from the ground, remove it from the XML
 * so it will no longer be redndered when the room is re-entered
 * and add the item to the player's inventory
 */
Item.prototype.getItem = function(player)
{
	if(player.tag == 'player')
	{
	 	if(this.itemType == 'key')
	 	{
	 		// add the item to the inventory by calling the player's
	 		// appropriate add item call depending on item type
	 		player.addKeyToInventory(this);
	 	}

	 	// remove the item from both the player colliders and the current level items
	 	var indexInLevelItems = currentLevelItems.indexOf(this);
	 	var indexInPlayerColliders = playerColliders.indexOf(this);
	 	
	 	if(indexInLevelItems > -1 && indexInPlayerColliders > -1)
	 	{
	 		// remove from the arrays
	 		currentLevelItems.splice(indexInLevelItems, 1);
	 		playerColliders.splice(indexInPlayerColliders, 1);

	 		// remove it from the xml
	 		var itemToRemove = levels[currentLevel].getElementsByTagName('item')[indexInLevelItems];
	 		itemToRemove.parentNode.removeChild(itemToRemove);
	 		return true;
	 	}
	 }
	 else
	 {
	 	return false;
	 }
}


/* Item Renderer
 * Uses the object render function
 */
Item.prototype.render = function()
{
	this.Object.render();
}

// EDGE OBJECT BUILDING METHODS
/* CalculateEdgeObjectX and CalculateEdgeObjectY
 * these two functions derrive the proper X and Y co-ordinates for an edge object (Door, or Wall) based
 * on the input of a direcion as 'N', 'E', 'S', or 'W'
 */ 
function calculateDoorX(direction)
{
	switch(direction)
	{
		case 'N':
		case 'S':
			return (owWidth / 2) - 40;
		case 'W':
			return 0;
		case 'E':
			return owWidth - 20;
	}
}

function calculateWallX(direction, firstSegment)
{
	switch(direction)
	{
		case 'N':
		case 'S':
			if(firstSegment)
			{
				return 0;
			} else
			{
				return (owWidth * 0.5) + 40;
			}
			break;
		case 'W':
			return 0;
			break;
		case 'E':
			return owWidth - 20;
			break;
	}
}


function calculateDoorY(direction)
{
	switch(direction)
	{
		case 'E':
		case 'W':
			return (owHeight * 0.5) - 40;
		case 'N':
			return 0;
		case 'S':
			return owHeight - 20;
	}
}
function calculateWallY(direction, firstSegment)
{
	switch(direction)
	{
		case 'N':
			return 0;
			break;
		case 'E':
		case 'W':
			if(firstSegment)
			{
				return 0;
			} else
			{
				return (owHeight * 0.5) + 40;
			}
		case 'S':
			return owHeight - 20;
	}
}

/* CalculateEdgeObjectWidth and CalculateEdgeObjectHeight
 * Like the calculateEdgeObjectX and calculateEdgeObjectY, these return values for the width
 * and the height of an edge object (wall or door)
 * all walls get the same values if they have doors or not
 * the render function handles splitting the wall into two seperate objects based on the 
 * default width and height
 */
 function calculateDoorWidth(direction)
 {

	switch(direction)
	{
		case 'N':
		case 'S':
			return 80;
		case 'E':
		case 'W':
			return 20;
	}
 }

 function calculateWallWidth(direction, fullWall)
 {
	switch(direction)
	{
		case 'N':
		case 'S':
			if(fullWall)
			{
				return owWidth;
			}else
			{
				return (owWidth * 0.5) - 40;
			}
		case 'E':
		case 'W':
			return 20;
	}
 }

 function calculateDoorHeight(direction)
 {
	switch(direction)
	{
		case 'N':
		case 'S':
			return 20;
		case 'E':
		case 'W':
			return 80;
	}
}

function calculateWallHeight(direction, fullWall)
{
	switch(direction)
	{
		case 'N':
		case 'S':
			return 20;
		case 'E':
		case 'W':
			if(fullWall)
			{
				return owHeight;
			}else
			{
				return (owHeight * 0.5) - 40;
			}
	}
}