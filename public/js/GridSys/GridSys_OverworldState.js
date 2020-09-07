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
    constructor(gfxEngine, inputEngine, player){
        this.gfxRef = gfxEngine;
        this.inputRef = inputEngine;
        this.playerRef = player;

        this.dynamicBodies = [ player ];

        this.directions = ['N', 'E', 'S', 'W'];
        
        this.level = loadJSON("json/levelData.json");
        this.currentRoom = 0;
        this.nextRoom = 0;

        // TODO: change these hardcoded values to read from the level
        // (will allow for changeable room sizes)
        this.gfxRef.canvas.width = 820;
        this.gfxRef.canvas.height = 600;

        this.roomGrid = new Grid(41, 30, 20, 20, 1, 1);
        this.movementGrid = new MovementGrid(this.roomGrid);

        // initialize some variables
        this.stateName = "overworld";
        this.needsRefresh = true;
        this.roomBuilt = false;

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
            this.buildRoom(this.currentRoom);
            this.roomBuilt = true;
        }

        // MOVEMENT SYSTEM
        let allMoves = [];
        for(let i = 0; i < this.dynamicBodies.Length; i++)
        {
            allMoves[i] = this.dynamicBodies.getMoveUpdate();
        }
        this.movementGrid.ResolveMoves(allMoves);

        if (this.playerRef.stepped)
        {
            this.currentLevelRndEncounterEngine.addSteps(this.playerRef.stepsTaken);
        }

        if(this.loadNextLevel())
        {
            this.roomBuilt = false;
            this.currentRoom = this.nextRoom;
        }
    }

    loadNextLevel(){
        return false;
    }

    /* render
    * renders the new positions of all objects after the update
    */
    render(){
        // refresh background
        this.gfxRef.context.fillStyle = "#3CF";
        this.gfxRef.context.fillRect(0, 0, this.gfxRef.canvas.width, this.gfxRef.canvas.height);

        // render elements of world
        this.playerRef.render(this.gfxRef.context);
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
    buildRoom(roomNumber){
        // TODO: All this logic again
        // *le sigh* :/
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