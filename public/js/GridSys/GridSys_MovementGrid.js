/* Simple Adventure Grid System - Movement Grid
* A wrapper around the grid base class with movement utility functions
* Version: 0.1
* Date Created: 09.07.2020
* Last Updated: 03.13.2021
* Author: Matheu Plouffe
*
* History
* 0.1 - Initial implementation
* 0.2 - Added Grid Collider
*/

class Move
{
    constructor(dynamicObject, origin, target) {
        this.dynamicObject = dynamicObject;
        this.origin = origin;
        this.target = target;
    }
}

class MoveResult
{
    constructor(destination, result) {
        this.destination = destination;
        this.result = result;
    }
}

class MovementGrid
{
    constructor(basisGrid, gridCollider) {
        this.grid = basisGrid;
        this.colliderMatrix = [];
        for (let i = 0; i < this.grid.col; i++) {
            this.colliderMatrix[i] = [];
        }
        this.gridCollider = gridCollider;
    }

    buildRoom(currentRoom) {
        for (let i = 0; i < currentRoom.doors.length; i++) {
            let currentDoor = currentRoom.doors[i];
            for (let j = 0; j < currentDoor.origins.length; j++) {
                let xMax = currentDoor.origins[j].x + currentDoor.dimension.w;
                let yMax = currentDoor.origins[j].y + currentDoor.dimension.l;
                for (let x = currentDoor.origins[j].x; x < xMax; x++) {
                    for (let y = currentDoor.origins[j].y; y < yMax; y++) {
                        this.colliderMatrix[x][y] = { 
                                                        "type": Colliders.door,
                                                        "entity": currentDoor
                                                    };
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
                        this.colliderMatrix[x][y] = {
                                                        "type": Colliders.wall
                                                    };
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
            // if trying to move outside the bounds of the level, don't even don't allow it
            if (currentMove.target.x < 0 || 
                currentMove.target.x >= this.grid.col ||
                currentMove.target.y < 0 || 
                currentMove.target.y >= this.grid.row )
            {
                // TODO: check for attempt to exit out door
                // - fix collision resolution first
                // - then when in this state, check array of current position collider in collider matrix
                // - if it contains the door collider, trigger exit logic from door
                let moveResult = new MoveResult(currentMove.origin,
                                                currentMove.origin,
                                                false);
                currentMove.dynamicObject.resolveMove(moveResult);
            }
            else
            {
                let collisions = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
                if (Boolean(collisions))
                {
                    let currentCollider = { 
                        "type": currentMove.dynamicObject.collider, 
                        "entity": currentMove.dynamicObject
                    };
                    let colliders = [ collisions, currentCollider];
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = this.gridCollider.resolveCollision(colliders);
                }
                else
                {
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = { 
                                                                                        "type": currentMove.dynamicObject.collider, 
                                                                                        "entity": currentMove.dynamicObject
                                                                                    };
                    let moveResult = new MoveResult(currentMove.target, true);
                    this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = currentMove.dynamicObject.resolveMove(moveResult);
                }
            }
        }
    }
}