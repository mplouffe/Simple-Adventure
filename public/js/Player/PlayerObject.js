/* Player Object
 * A simple grid based movement object for players
 * Version: 0.1
 * Date Created: 08.31.2020
 * Last Updated: 09.04.2020
 * Author: Matheu Plouffe
 */

function PlayerObject(x, y, width, height, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
    this.color = color;
}

PlayerObject.prototype.move = function(x, y)
{
	this.x += x;
	this.y += y;
}
