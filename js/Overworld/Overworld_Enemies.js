/* Simple Adventure Enemy
 * All the logic and AI for the enemies in Simple Adventure Game
 * Version: 0.1
 * Date Created: 07.01.2016
 * Last Update: 07.01.2016
 * Author: Matheu Plouffe
 */

/* ENEMIES
*/
function Enemy(x, y, enemyType){
	
	let enemyHeight = getEnemyHeight(enemyType);
	let enemyWidth = getEnemyWidth(enemyType);
	let enemyColor = getEnemyColor(enemyType);
	this.Object = new Object(x, y, enemyWidth, enemyHeight, enemyColor);
	this.enemySpeed = getEnemySpeed(enemyType);
	this.direction = [0,0];
}

function getEnemyHeight(enemyType)
{
	switch(enemyType)
	{
		case 'orc':
			return 30;
		case 'skeleton':
			return 20;
		case 'goblin':
			return 10;
	}
}

function getEnemyWidth(enemyType)
{
	switch(enemyType)
	{
		case 'orc':
			return 30;
		case 'skeleton':
			return 20;
		case 'goblin':
			return 10;
	}
}

function getEnemyColor(enemyType)
{
	switch(enemyType)
	{
		case 'orc':
			return '#006600';
		case 'skeleton':
			return '#e0ebeb';
		case 'goblin':
			return '#66ff33';
	}
}

function getEnemySpeed(enemyType)
{
	switch(enemyType)
	{
		case 'orc':
			return 4;
		case 'skeleton':
			return 2;
		case 'goblin':
			return 3;
	}
}

Enemy.prototype.getDirection = function()
{

	if(this.Object.y - player.Object.y > 0)
	{
		direction[0] = -1;
	}
	else
	{
		direction[0] = 1;
	}
	if(this.Object.x - player.Object.x > 0)
	{
		direction[1] = -1;
	}
	else
	{
		direction[1] = 1;
	}
}

Enemy.prototype.update = function()
{
	if(this.direction[0] < 0 && this.movementArray[0])
	{
		this.Object.y += this.speed * direction[0];
	}else if(this.direction[0] > 0 && this.movementArray[2])
	{
		this.Object.y += this.speed * direction[0];
	}

	if(this.direction[1] < 0 && this.movementArray[3])
	{
		this.Object.x += this.speed * direction[1];
	}else if(this.direction[1] > 0 && this.movementArray[1])
	{
		this.Object.x += this.speed * direction[1];
	}
}

Enemy.prototype.render = function()
{
	this.Object.render();
}

