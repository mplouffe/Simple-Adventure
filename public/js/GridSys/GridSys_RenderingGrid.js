
class RenderingGrid {
    constructor(worldGrid, gfxEngineRef, baseColor) {
        this.grid = worldGrid;
        this.gfxRef = gfxEngineRef;
        this.baseColor = baseColor;
        this.dynamicElementsToRender = [];
        this.staticElementsToRender = [];
    }

    addDynamicElement(elementToAdd) {
        if (elementToAdd.gridTransform === null || elementToAdd.gridRenderer === null) {
            console.log("trying to add element with missing components required for rendering");
            return;
        }

        this.dynamicElementsToRender[this.dynamicElementsToRender.length] = 
        {
            x: elementToAdd.gridTransform.location.x,
            y: elementToAdd.gridTransform.location.y,
            width: elementToAdd.gridTransform.width,
            height: elementToAdd.gridTransform.height,
            fillStyle: elementToAdd.gridRenderer.color
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

        for (let i = 0; i < this.dynamicElementsToRender.length; i++) {
            let currentRenderingElement = this.dynamicElementsToRender[i];
            this.gfxRef.context.fillStyle = currentRenderingElement.fillStyle;
            this.gfxRef.context.fillRect(
                this.grid.getXPos(currentRenderingElement.x),
                this.grid.getYPos(currentRenderingElement.y),
                this.grid.width * currentRenderingElement.width,
                this.grid.height * currentRenderingElement.height
            );
        }

        for (let i = 0; i < this.staticElementsToRender.length; i++) {
            let currentRenderingElement = this.staticElementsToRender[i];
            this.gfxRef.context.fillStyle = currentRenderingElement.fillStyle;
            this.gfxRef.context.fillRect(
                this.grid.getXPos(currentRenderingElement.x),
                this.grid.getYPos(currentRenderingElement.y),
                this.grid.width * currentRenderingElement.width,
                this.grid.height * currentRenderingElement.height
            );
        }
        
        this.dynamicElementsToRender = [];
    }
}