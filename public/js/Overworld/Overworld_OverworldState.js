/* GridWorld_OverworldState
 * The Overworld state for the Simple Adventure RPG engine.
 * Version: 0.3
 * Date Created: 06.27.2016
 * Last Update: 03.17.2021
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation
 * 0.2 - updating state housekeeping functions
 * 0.3 - changing over to use a grid based world
 */


/* setUp
 * - creates the canvas, sets up the animate, and starts the game loop
 */

class OverWorldState {
    constructor(gfxEngine, player, stateFactory){
        this.gfxRef = gfxEngine;
        this.playerRef = player;

        this.dynamicBodies = [ this.playerRef ];
        this.staticBodies = [];
        this.gridCollider = new GridCollider(stateFactory);
        
        this.level = loadJSON("json/levelData.json");

        this.currentRoomIndex = 0;
        this.nextRoomIndex = 0;

        // initialize some variables
        this.stateName = "overworld";
        this.needsRefresh = true;
        this.roomBuilt = false;
        this.shouldLoadLevel = false;

        // create the UI
        this.gfxRef.ui.setAttribute('class', 'textAdventureUI');
        this.gfxRef.ui.setAttribute('id', 'overworldUI');
        this.gfxRef.ui.innerHTML = 'Health: ' + this.playerRef.playerBattler.hitPoints +
                ' Mana: ' + this.playerRef.playerBattler.magicPoints +
                ' Score: ' + this.playerRef.score;
    }

    /* update
    * calls update on all the game elements
    */
    update() {
        if(!this.roomBuilt){
            this.buildRoom();
        }

        // MOVEMENT SYSTEM
        // 1) Get all proposed moves for all dynamic bodies
        let allMoves = [];
        this.dynamicBodies.forEach(dynamicBody => allMoves.push(dynamicBody.getMove()));

        this.movementGrid.resolveMoves(allMoves, this);

        if (this.playerRef.stepped)
        {
            this.currentLevelRndEncounterEngine.addSteps(this.playerRef.stepsTaken);
        }

        if(this.loadNextLevel())
        {
            this.shouldLoadLevel = false;
            this.roomBuilt = false;
            this.currentRoomIndex = this.nextRoom;
        }

        let victory = this.playerRef.checkForItemByType("victory");
        return victory;
    }

    loadNextLevel(){
        return this.shouldLoadLevel;
    }

    /* render
    * renders the new positions of all objects after the update
    */
    render(){
        // Render Overworld
        // 1) Add elements to render
        this.dynamicBodies.forEach((dynamicBody) => {
            if (dynamicBody.gridRenderer.render)
            {
                this.renderingGrid.addDynamicElement(dynamicBody);
            }
        });
        this.staticBodies.forEach((staticBody) => {
            if (staticBody.gridRenderer.render)
            {
                this.renderingGrid.addDynamicElement(staticBody);
            }
        });

        // 2) Render all elements
        this.renderingGrid.render();
    }

    removeState()
    {
        this.gfxRef.ui.innerHTML = "";
    }

    coverState()
    {
    }

    getStateResult()
    {
        return StateResult.remove;
    }

    refresh()
    {
        if (typeof this.gfxRef.ui === 'undefined')
        {
            this.gfxRef.ui = document.createElement('div');
        }
        
        this.gfxRef.ui.setAttribute('id', 'overworldUI');
        this.gfxRef.ui.setAttribute('class', 'textAdventureUI');
        this.gfxRef.ui.innerHTML = 'Health: ' + this.playerRef.playerBattler.hitPoints +
                ' Mana: ' + this.playerRef.playerBattler.magicPoints +
                ' Score: ' + this.playerRef.score;

        let currentRoom = this.level.rooms[this.currentRoomIndex];
        this.gfxRef.canvas.setAttribute('class', 'overWorldWindow');
        this.gfxRef.canvas.width = currentRoom.width * currentRoom.cellWidth;
        this.gfxRef.canvas.height = currentRoom.height * currentRoom.cellHeight;
        this.gfxRef.gameWindow.setAttribute('class', 'overWorldSection')
    }

    /* BuildLevel
    * builds the room based on information from the level json file
    */
    buildRoom(){
        let currentRoom = this.level.rooms[this.currentRoomIndex];
        this.staticBodies.length = 0;
        this.gfxRef.canvas.width = currentRoom.width * currentRoom.cellWidth;
        this.gfxRef.canvas.height = currentRoom.height * currentRoom.cellHeight;
        this.roomGrid = new Grid(currentRoom.width, currentRoom.height, currentRoom.cellWidth, currentRoom.cellHeight, 1, 1);
        
        this.movementGrid = new MovementGrid(this.roomGrid, this.gridCollider);
        this.movementGrid.buildRoom(currentRoom);
        this.movementGrid.insertPlayer(this.playerRef);
        
        this.renderingGrid = new RenderingGrid(this.roomGrid, this.gfxRef, currentRoom.backgroundColor);
        this.renderingGrid.buildRoom(currentRoom);

        currentRoom.doors.forEach((currentDoor) => {
            if (currentDoor.locked)
            {
                currentDoor.gridRenderer = new GridRenderer(currentDoor.doorColor);
                currentDoor.gridTransform = new GridTransform(currentDoor.origins.x, currentDoor.origins.y, currentDoor.dimension.w, currentDoor.dimension.l);
                this.staticBodies.push(currentDoor);
            }
        });

        currentRoom.items.forEach((currentItem) => {
            if (!currentItem.pickedUp)
            {
                currentItem.gridRenderer = new GridRenderer(currentItem.itemColor);
                currentItem.gridTransform = new GridTransform(currentItem.itemLocation.x, currentItem.itemLocation.y, 1, 1);
                this.staticBodies.push(currentItem);
            }
        });

        this.currentLevelRndEncounterEngine = new RndEncounterEngine(5, 20);
        this.roomBuilt = true;
    }
}