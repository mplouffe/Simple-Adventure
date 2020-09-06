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
	this.items = {};
	this.playerKeys = {};
    this.playerBattler = new Battler(50, 50, 10, 10, 10, 10, 10, this.name);
    this.stepped = false;
    this.stepInterval = 100;
    this.lastStep = 0.0;
}

Player.prototype.update = function(inputEngine)
{
    this.stepped = false;
    if (this.lastStep > this.stepInterval) {
        let playerMove = { x: 0, y: 0 };
        for(let key in inputEngine.keysDown){
            let value = Number(key);
            switch (value)
            {
                case 37:
                    playerMove.x -= 1;
                    break;
                case 38:
                    playerMove.y -= 1;
                    break;
                case 39:
                    playerMove.x += 1;
                    break;
                case 40:
                    playerMove.y += 1;
                    break;
            }
        }

        if (playerMove.x != 0 || playerMove.y != 0)
        {
            let collisions = this.movementGrid.checkForCollisions(this.playerObject.location, playerMove);
            if (collisions.length == 0)
            {
                this.playerObject.move(playerMove.x, playerMove.y);
                this.stepped = true;
                this.lastStep = 0.0;
            }
            else
            {
                // TODO: Handle collisions!
            }
        }
    }
    this.lastStep += deltaTime;
}

Player.prototype.render = function(context)
{
    context.fillStyle = this.playerObject.color;
	context.fillRect(
        this.movementGrid.getXPos(this.playerObject.location.x),
        this.movementGrid.getYPos(this.playerObject.location.y),
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