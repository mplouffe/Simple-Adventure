/* GridWorld_OverworldState
 * The Overworld state for the Simple Adventure RPG engine.
 * Version: 0.3
 * Date Created: 06.27.2016
 * Last Update: 09.01.2020
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
    constructor(gfxEngine, player){
        this.gfxRef = gfxEngine;
        this.playerRef = player;

        this.dynamicBodies = [ this.playerRef ];
        this.gridCollider = new GridCollider();
        
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
        for(let i = 0; i < this.dynamicBodies.length; i++)
        {
            allMoves[i] = this.dynamicBodies[i].getMove();
        }
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
        this.renderingGrid.addDynamicElement(this.playerRef);
        // 2) Render all elements
        this.renderingGrid.render();
    }

    removeState()
    {
        this.gfxRef.ui.parentElement.removeChild(this.gfxRef.ui);
    }

    coverState()
    {
        this.gfxRef.ui.parentElement.removeChild(this.gfxRef.ui);
    }

    /* BuildLevel
    * builds the room based on information from the level json file
    */
    buildRoom(){
        let currentRoom = this.level.rooms[this.currentRoomIndex];
        this.gfxRef.canvas.width = currentRoom.width * currentRoom.cellWidth;
        this.gfxRef.canvas.height = currentRoom.height * currentRoom.cellHeight;
        this.roomGrid = new Grid(currentRoom.width, currentRoom.height, currentRoom.cellWidth, currentRoom.cellHeight, 1, 1);
        this.movementGrid = new MovementGrid(this.roomGrid, this.gridCollider);
        this.movementGrid.buildRoom(currentRoom);
        this.movementGrid.insertPlayer(this.playerRef);
        this.renderingGrid = new RenderingGrid(this.roomGrid, this.gfxRef, currentRoom.backgroundColor);
        for (let i = 0; i < currentRoom.walls.length; i++) {
            for (let j = 0; j < currentRoom.walls[i].origins.length; j++) {
                this.renderingGrid.addStaticElement(
                    currentRoom.walls[i].origins[j].x,
                    currentRoom.walls[i].origins[j].y,
                    currentRoom.walls[i].dimension.w,
                    currentRoom.walls[i].dimension.l,
                    currentRoom.wallColor);
            }
        }
        this.currentLevelRndEncounterEngine = new RndEncounterEngine(5, 20);
        this.roomBuilt = true;
    }

    refresh()
    {
        if (typeof this.gfxRef.ui === 'undefined')
        {
            this.gfxRef.ui = document.createElement('p');
        }
        
        this.gfxRef.ui.setAttribute('class', 'textAdventureUI');
        this.gfxRef.ui.innerHTML = 'Health: ' + this.playerRef.playerBattler.hitPoints +
                ' Mana: ' + this.playerRef.playerBattler.magicPoints +
                ' Score: ' + this.playerRef.score;

        this.gfxRef.canvas.setAttribute('class', 'overWorldWindow');
        this.gfxRef.canvas.width = owWidth;
        this.gfxRef.canvas.height = owHeight;
        this.gfxRef.gameWindow.appendChild(ui);
        this.gfxRef.gameWindow.setAttribute('class', 'overWorldSection')
    }
}