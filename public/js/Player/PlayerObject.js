/* Player Object
 * A simple grid based movement object for players
 * Version: 0.1
 * Date Created: 08.31.2020
 * Last Updated: 09.04.2020
 * Author: Matheu Plouffe
 */

class PlayerObject
{
    constructor(x, y, width, height, color){
        this.location = { x: x, y:y };
        this.width = width;
        this.height = height;
        this.color = color;
    }

    move(x, y)
    {
        this.location.x += x;
        this.location.y += y;
    }
}