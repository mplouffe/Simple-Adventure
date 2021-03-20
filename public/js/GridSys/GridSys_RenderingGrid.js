
class RenderingGrid {
    constructor(worldGrid, gfxEngineRef, baseColor) {
        this.grid = worldGrid;
        this.gfxRef = gfxEngineRef;
        this.baseColor = baseColor;
        this.dynamicElementsToRender = [];
        this.staticElementsToRender = [];
    }

    addDynamicElement(elementToAdd) {
        if (typeof elementToAdd.gridTransform === 'undefined' || typeof elementToAdd.gridRenderer === 'undefined') {
            console.log("trying to add element with missing components required for rendering");
            return;
        }

        this.dynamicElementsToRender.push({
            x: elementToAdd.gridTransform.location.x,
            y: elementToAdd.gridTransform.location.y,
            width: elementToAdd.gridTransform.width,
            height: elementToAdd.gridTransform.height,
            fillStyle: elementToAdd.gridRenderer.color
        });
    }

    buildRoom(currentRoom)
    {
        for (let i = 0; i < currentRoom.walls.length; i++) {
            for (let j = 0; j < currentRoom.walls[i].origins.length; j++) {
                this.addStaticElement(
                    currentRoom.walls[i].origins[j].x,
                    currentRoom.walls[i].origins[j].y,
                    currentRoom.walls[i].dimension.w,
                    currentRoom.walls[i].dimension.l,
                    currentRoom.wallColor);
            }
        }
    }

    addStaticElement(x, y, width, height, color) {
        this.staticElementsToRender[this.staticElementsToRender.length] = 
        {
            x: x,
            y: y,
            width: width,
            height: height,
            fillStyle: color
        }
    }

    render() {
        // refresh background
        this.gfxRef.context.fillStyle = this.baseColor;
        this.gfxRef.context.fillRect(0, 0, this.gfxRef.canvas.width, this.gfxRef.canvas.height);

        this.dynamicElementsToRender.forEach(dynamicElement => this.renderCurrentElement(dynamicElement));
        this.staticElementsToRender.forEach(staticElement => this.renderCurrentElement(staticElement));        
        this.dynamicElementsToRender.length = 0;
    }

    renderCurrentElement(currentRenderingElement)
    {
        this.gfxRef.context.fillStyle = currentRenderingElement.fillStyle;
        this.gfxRef.context.fillRect(
            this.grid.getXPos(currentRenderingElement.x),
            this.grid.getYPos(currentRenderingElement.y),
            this.grid.width * currentRenderingElement.width,
            this.grid.height * currentRenderingElement.height
        );
    }
}