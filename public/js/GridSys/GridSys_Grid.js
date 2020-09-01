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

function Grid(col, row, colWidth, rowHeight, originX, originY) {
    this.col = col;
    this.row = row;
    this.width = colWidth;
    this.height = rowHeight;
    this.originX = originX;
    this.originY = originY;
}

Grid.prototype.render = function()
{
    let totalWidth = this.width * this.col;
    let totalHeight = this.height * this.row;

    context.strokeStyle = "#000000";
    context.beginPath();

    for (let x = 0; x <= this.col; x++) {
        context.moveTo(this.originX + (x * this.width), this.originY);
        context.lineTo(this.originX + (x * this.width), this.originY + totalHeight);
    }

    for (let y = 0; y <= this.row; y++) {
        context.moveTo(this.originX, this.originY + (y * this.height));
        context.lineTo(this.originX + totalWidth, this.originY + (y * this.height));
    }
    context.stroke();
}

Grid.prototype.getXPos = function(xPos) {
    if (xPos > this.col || xPos < 0) {
        return -1;
    }
    return xPos * this.width;
}

Grid.prototype.getYPos = function(yPos) {
    if (yPos > this.row || yPos < 0) {
        return -1;
    }
    return yPos * this.height;
}