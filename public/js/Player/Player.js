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

class Player {
    constructor(score, health, mana, name, inputEngine){
        this.score = score;
        this.health = health;
        this.mana = mana;
        this.name = name;
        this.gridTransform = new GridTransform(10, 10, 1, 1);
        this.gridRenderer = new GridRenderer('#FFF');
        this.gridCollider = new PlayerCollider(this.gridTransform);
        this.inputEngine = inputEngine;
        this.tag = 'player';
        this.items = {};
        this.playerKeys = {};
        this.playerBattler = new Battler(50, 50, 10, 10, 10, 10, 10, this.name);
        this.stepped = false;
        this.stepInterval = 25;
        this.lastStep = 0.0;
    }

    getMove()
    {
        this.stepped = false;
        this.stepsTaken = 0;
        this.playerMove = { x: 0, y: 0 };

        if (this.lastStep > this.stepInterval) {
            for(let key in this.inputEngine.keysDown){
                let value = Number(key);
                switch (value)
                {
                    case 37:
                        this.playerMove.x -= 1;
                        break;
                    case 38:
                        this.playerMove.y -= 1;
                        break;
                    case 39:
                        this.playerMove.x += 1;
                        break;
                    case 40:
                        this.playerMove.y += 1;
                        break;
                }
            }
        }
        this.lastStep += deltaTime;

        if (this.playerMove.x == 0 && this.playerMove.y == 0)
        {
            return null;
        }
        else
        {
            this.lastStep = 0;
            let move = new Move(
                this.gridCollider,
                {
                    x: this.gridTransform.location.x,
                    y: this.gridTransform.location.y
                },
                {
                    x: this.gridTransform.location.x + this.playerMove.x,
                    y: this.gridTransform.location.y + this.playerMove.y
                }
            );
            return move;
        }
    }

    addKeyToInventory(key)
    {
        this.playerKeys.push(key);
    }

    checkForKey(door)
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
}