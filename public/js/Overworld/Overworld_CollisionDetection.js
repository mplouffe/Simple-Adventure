/* Collision Detection System
 * A simple collision detection system using AABB
 * Version: 0.1
 * Date Created: 06.28.2016
 * Last Updated: 07.01.2016
 * Author: Matheu Plouffe
 * Special thanks: Andrew Roncin, Roberto 
 */

function Object(x, y, width, height, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
}

Object.prototype.render = function()
{
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
}

Object.prototype.move = function(x, y)
{
	this.x += x;
	this.y += y;
}

// COLLISION DETECTION SYSTEM
Object.prototype.checkCollision = function(selfObject, otherObjects){

	for(let i = 0; i < 4; i++)
	{
		selfObject.movementArray[i] = true;
	}		

	for(let i = 0; i < otherObjects.length; i++)
	{
		let other = otherObjects[i].Object;
		
		if(this.x < other.x + other.width + 2 &&
			this.x + this.width + 2 > other.x &&
			this.y < other.y + other.height + 2 &&
			this.y + this.height + 2 > other.y)
		{
			let colliderTag = otherObjects[i].tag;

			if(colliderTag == "door")
			{
				let door = otherObjects[i];
				if(door.locked)
				{
					if(selfObject.checkForKey(door))
					{
						let wallXML = levels[currentLevel].getElementsByTagName('doorNumber')[door.doorNumber].parentNode;
						wallXML.getElementsByTagName('locked')[0].firstChild.nodeValue = false;
						door.locked = false;
					}else
					{
						colliderTag = "solid";
					}
				} else {
					nextLevel = door.exitTo;
				}
			}

			if(colliderTag == "item")
			{
				let item = otherObjects[i];
				if(item.itemType == "fight")
				{
					let uiToRemove = document.getElementsByTagName('p')[0];
					let parent = uiToRemove.parentElement;
					parent.removeChild(uiToRemove);
					stateMachine.pushState(new FightState(gameWindow, canvas));
				}

				if(!item.getItem(selfObject))
				{
					colliderTag = "solid";
				}
			}

			if(colliderTag == "solid")
			{
				if(this.y - 2 < other.y + other.height &&
					this.y + 2 > other.y + other.height)
				{
					selfObject.movementArray[0] = false;
				} else if(this.x + this.width - 2 < other.x &&
					this.x + this.width + 2 > other.x)
				{
					selfObject.movementArray[1] = false;
				}else if(this.y + this.height -2 < other.y &&
					this.y + this.height + 2 > other.y)
				{
					selfObject.movementArray[2] = false;
				}else if(this.x + 2 > other.x + other.width &&
					this.x - 2 < other.x + other.width + 2)
				{
					selfObject.movementArray[3] = false;		
				}
			} else if(colliderTag == "player")
			{
				// CODE FOR ENEMY COLLIDING WITH PLAYER
			}
		}
	}
}