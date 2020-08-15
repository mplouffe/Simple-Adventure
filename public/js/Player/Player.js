/* Simple Adventure Player
 * the player class for the simple rpg game
 * Version: 0.1
 * Date Created: 08.26.2016
 * Last Updated: 08.26.2016
 * Author: Matheu Plouffe
 */

function Player(score, health, mana, name){
	this.score = score;
	this.health = health;
	this.mana = mana;
	this.name = name;
	this.playerLocation = [100, 100];
	this.Object = new Object(this.playerLocation[0], this.playerLocation[1], 20, 20, "#FFF");
	this.movementArray = [true, true, true, true];
	this.tag = 'player';
	this.itemArray = [];
	this.playerKeys = [];
	this.playerLocation = [];
    this.playerBattler = new Battler(50, 50, 10, 10, 10, 10, 10, "Steve");
    this.moved = false;
    this.stepped = false;
    this.steppingTime = 0.0;
    this.stepInterval = 2.0;
}

Player.prototype.update = function()
{
    this.moved = false;

    if (this.stepped = true) {
        this.steppinTime = 0.0;
        this.stepped = false;
    }
    this.stepped = false;
	for(var key in keysDown){
		var value = Number(key);
		if(value == 37 && this.movementArray[3]){
			// left arrow
			this.Object.move(-2, 0);
            this.playerLocation[0] -= 2;
            this.moved = true;
		} else if(value == 38 && this.movementArray[0]){
			this.Object.move(0, -2);
            this.playerLocation[1] -= 2;
            this.moved = true; 
		}else if (value == 39 && this.movementArray[1]) {
			// right arrow
			this.Object.move(2, 0);
            this.playerLocation[0] += 2;
            this.moved = true;
		}else if (value == 40 && this.movementArray[2]){
			this.Object.move(0, 2);
            this.playerLocation[1] += 2;
            this.moved = true;
		}
		 else {
			this.Object.move(0, 0);
		}
    }

    if (this.moved)
    {
        this.steppingTime += deltaTime / 1000;
        if (this.steppingTime >= this.stepInterval) {
            this.stepped = true;
        }
    }
}

Player.prototype.render = function()
{
	this.Object.render();
}

Player.prototype.addKeyToInventory = function(key)
{
	this.playerKeys.push(key);
}

Player.prototype.checkForKey = function(door)
{
	for(var i = 0; i < this.playerKeys.length; i++)
	{
		if(this.playerKeys[i].itemID == door.key)
		{
			return true;
		}
	}
	return false;
}