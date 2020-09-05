/* Simple Adventure Player
 * the player class for the simple rpg game
 * Version: 0.1
 * Date Created: 08.26.2016
 * Last Updated: 09.04.2020
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation
 * 0.2 - Changing over to the grid based system
 */

function Player(score, health, mana, name, movementGrid){
	this.score = score;
	this.health = health;
	this.mana = mana;
    this.name = name;
    this.movementGrid = movementGrid;
	this.playerLocation = [10, 10];
	this.playerObject = new PlayerObject(this.playerLocation[0], this.playerLocation[1], 20, 20, "#FFF");
	this.tag = 'player';
	this.itemArray = [];
	this.playerKeys = [];
    this.playerBattler = new Battler(50, 50, 10, 10, 10, 10, 10, this.name);
    this.stepped = false;
    this.stepInterval = 100;
    this.lastStep = 0.0;
}

Player.prototype.update = function(inputEngine)
{
    this.stepped = false;
    if (this.lastStep > this.stepInterval) {
        for(let key in inputEngine.keysDown){
            let value = Number(key);
            if(value == 37 && this.movementArray[3]){
                // left arrow
                this.playerObject.move(-1, 0);
                this.playerLocation[0] -= 1;
                this.stepped = true;
                this.lastStep = 0.0;
            } else if(value == 38 && this.movementArray[0]){
                this.playerObject.move(0, -1);
                this.playerLocation[1] -= 1;
                this.stepped = true;
                this.lastStep = 0.0;
            }else if (value == 39 && this.movementArray[1]) {
                // right arrow
                this.playerObject.move(1, 0);
                this.playerLocation[0] += 1;
                this.stepped = true;
                this.lastStep = 0.0;
            }else if (value == 40 && this.movementArray[2]){
                this.playerObject.move(0, 1);
                this.playerLocation[1] += 1;
                this.stepped = true;
                this.lastStep = 0.0;
            }
             else {
                this.playerObject.move(0, 0);
            }
        }
    }
    this.lastStep += deltaTime;
}

Player.prototype.render = function(context)
{
    context.fillStyle = this.playerObject.color;
	context.fillRect(
        this.movementGrid.getXPos(this.playerObject.x),
        this.movementGrid.getYPos(this.playerObject.y),
        this.playerObject.width,
        this.playerObject.height
    );
}

Player.prototype.setMovementGrid = function(movementGrid)
{
    this.movementGrid = movementGrid;
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