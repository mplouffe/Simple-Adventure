/* Simple Adventure Grid System - Movement Grid
* A wrapper around the grid base class with movement utility functions
* Version: 0.1
* Date Created: 09.07.2020
* Last Updated: 09.07.2020
* Author: Matheu Plouffe
*
* History
* 0.1 - Initial implementation
*/

class Move
{
    constructor(dynamicObject, origin, target) {
        this.dynamicObject = dynamicObject;
        this.origin = origin;
        this.target = target;
        this.result = false;
    }
}

class MovementGrid
{
    constructor(basisGrid) {
        this.grid = basisGrid;
        this.colliderMatrix = [];
        for (let i = 0; i < this.grid.col; i++) {
            this.colliderMatrix[i] = [];
        }
    }

    buildRoom(currentRoom) {
        for (let i = 0; i < currentRoom.doors.length; i++) {
            let currentDoor = currentRoom.doors[i];
            for (let j = 0; j < currentDoor.origins.length; j++) {
                let xMax = currentDoor.origins[j].x + currentDoor.dimension.w;
                let yMax = currentDoor.origins[j].y + currentDoor.dimension.l;
                for (let x = currentDoor.origins[j].x; x < xMax; x++) {
                    for (let y = currentDoor.origins[j].y; y < yMax; y++) {
                        this.colliderMatrix[x][y] = 'D';
                    }
                }
            }
        }

        for (let i = 0; i < currentRoom.walls.length; i++) {
            let currentWall = currentRoom.walls[i];
            for (let j = 0; j < currentWall.origins.length; j++) {
                let xMax = currentWall.origins[j].x + currentWall.dimension.w;
                let yMax = currentWall.origins[j].y + currentWall.dimension.l;
                for (let x = currentWall.origins[j].x; x < xMax; x++) {
                    for (let y = currentWall.origins[j].y; y < yMax; y++) {
                        this.colliderMatrix[x][y] = 'W';
                    }
                }
            }
        }
    }

    resolveMoves(allMoves) {
        if (allMoves.length == 0)
        {
            return;
        }

        let sortedMoves = allMoves
                            .filter(Boolean)
                            .sort((a, b) => {
                                if (a.initiative < b.initiative) return 1;
                                else if (a.initiative > b.initiative) return -1;
                                else return 0;
                            });

        for (let i = 0; i < sortedMoves.length; i++)
        {
            let currentMove = sortedMoves[i];
            if (currentMove.target.x < 0 || 
                currentMove.target.x >= this.grid.col ||
                currentMove.target.y < 0 || 
                currentMove.target.y >= this.grid.row )
            {
                currentMove.result = false;
                currentMove.dynamicObject.resolveMove(currentMove);
            }
            else
            {
                let collisions = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
                if (Boolean(collisions))
                {
                    currentMove.dynamicObject.resolveCollision(collisions);
                }
                else
                {
                    currentMove.result = true;
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = currentMove.dynamicObject.collider;
                    this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = currentMove.dynamicObject.resolveMove(currentMove);
                }
            }
        }
    }
}