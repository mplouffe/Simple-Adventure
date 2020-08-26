/* Simple Adventure Grid System
* A simple grid representation system used for visuals and game mechanics
* Version: 0.1
* Date Created: 08.23.2020
* Last Updated: 08.23.2020
* Author: Matheu Plouffe
*
* History
* 0.1 - Initial implementation
*/

function Grid(x, y, width, height, originX, originY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.originX = originX;
    this.originY = originY;
}

Grid.prototype.render = function()
{
    for (let x = 0; x <= this.width; x += 40) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }

    for (let y = 0; y <= this.height; y += 40) {
        context.moveTo(p, 0.5 + y + p);
        context.lineTo(bw + p, 0.5 + y + p);
    }
    context.strokeStyle = "black";
    context.stroke();
}