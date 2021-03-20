/* Grid Transform
 * A simple grid based transform for objects
 * Version: 0.1
 * Date Created: 08.31.2020
 * Last Updated: 09.07.2020
 * Author: Matheu Plouffe
 */

class GridTransform
{
    constructor(x, y, width, height){
        this.location = { x: x, y:y };
        this.width = width;
        this.height = height;
    }

    moveIncrement(x, y)
    {
        this.location.x += x;
        this.location.y += y;
    }

    move(x, y)
    {
        this.location.x = x;
        this.location.y = y;
    }

    // TODO: implement as needed
    // - adjust width and height
    // - scale along axis
}