/* Simple Adventure Grid System
* A simple grid system used for visuals and game mechanics
* Version: 0.1
* Date Created: 08.23.2020
* Last Updated: 08.23.2020
* Author: Matheu Plouffe
*
* History
* 0.1 - Initial implementation
*/

class Grid
{
    constructor(col, row, colWidth, rowHeight, originX, originY) {
        this.col = col;
        this.row = row;
        this.width = colWidth;
        this.height = rowHeight;
        this.originX = originX;
        this.originY = originY;

        let canvas = document.getElementById('gameCanvas');
        this.context = canvas.getContext('2d');
    }

    render()
    {
        let totalWidth = this.width * this.col;
        let totalHeight = this.height * this.row;

        this.context.strokeStyle = "#000000";
        this.context.beginPath();

        for (let x = 0; x <= this.col; x++) {
            this.context.moveTo(this.originX + (x * this.width), this.originY);
            this.context.lineTo(this.originX + (x * this.width), this.originY + totalHeight);
        }

        for (let y = 0; y <= this.row; y++) {
            this.context.moveTo(this.originX, this.originY + (y * this.height));
            this.context.lineTo(this.originX + totalWidth, this.originY + (y * this.height));
        }
        this.context.stroke();
    }

    getXPos(xPos) {
        if (xPos > this.col || xPos < 0) {
            return -1;
        }
        return xPos * this.width;
    }

    getYPos(yPos) {
        if (yPos > this.row || yPos < 0) {
            return -1;
        }
        return yPos * this.height;
    }
}