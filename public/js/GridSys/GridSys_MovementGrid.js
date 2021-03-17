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
    constructor(destinationX, destinationY, result) {
        this.destination = {
            x: destinationX,
            y: destinationY
        };
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

    resolveMoves(allMoves, overworldState) {
        if (allMoves.length == 0)
        {
            return;
        }

        let sortedMoves = allMoves
                            .filter(Boolean)
                            .sort((a, b) => {
                                if (a.initiative > b.initiative) return 1;
                                else if (a.initiative < b.initiative) return -1;
                                else return 0;
                            });

        while (sortedMoves.length > 0)
        {
            let currentMove = sortedMoves.pop();
            console.log("going through sorted moves");
            // if trying to move outside the bounds of the level, don't even don't allow it
            if (currentMove.target.x < 0 || 
                currentMove.target.x >= this.grid.col ||
                currentMove.target.y < 0 || 
                currentMove.target.y >= this.grid.row )
            {
                let moveResult;
                let collisions = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                if (this.checkPlayerCollisionsWithDoor(collisions))
                {
                    overworldState.shouldLoadLevel = true;
                    overworldState.nextRoom = collisions.entity.exitTo;

                    if (currentMove.target.x < 0)
                    {
                        moveResult = new MoveResult(this.grid.col, currentMove.target.y, true);
                    }
                    else if (currentMove.target.x >= this.grid.col)
                    {
                        moveResult = new MoveResult(0, currentMove.target.y, true);
                    }
                    else if (currentMove.target.y < 0)
                    {
                        moveResult = new MoveResult(currentMove.target.x, this.grid.row, true);
                    }
                    else if (currentMove.target.y >= this.grid.row)
                    {
                        moveResult = new MoveResult(currentMove.target.x, 0, true);
                    }
                }
                else
                {
                    moveResult = new MoveResult(currentMove.origin.x,
                        currentMove.origin.y,
                        false);
                }

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
                    console.log("colliders:");
                    console.log(colliders);
                    let collisionResults = this.gridCollider.resolveCollision(colliders, currentMove);
                    console.log("collisonResults: ");
                    console.log(collisionResults);
                    this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = collisionResults.origin;
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = collisionResults.target;
                    currentMove.dynamicObject.resolveMove(collisionResults.moveResult);
                }
                else
                {
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = { 
                                                                                        "type": currentMove.dynamicObject.collider, 
                                                                                        "entity": currentMove.dynamicObject
                                                                                    };
                    let currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                    console.log("currentColliders: ");
                    console.log(currentColliders);
                    let moveResult = new MoveResult(currentMove.target.x, currentMove.target.y, true);

                    if (currentColliders != null && currentColliders.length > 1)
                    {
                        let filteredColliders = [];
                        for(let i = 0; i < currentColliders.length; i++)
                        {
                            console.log("for collider in currentColliders");
                            console.log(currentColliders[i]);
                            if (currentColliders[i].type != currentMove.dynamicObject.collider)
                            {
                                filteredColliders.push(currentColliders[i]);
                            }
                        }
                        let dyamicMoverResult = currentMove.dynamicObject.resolveMove(moveResult);
                        if (dyamicMoverResult != null)
                        {
                            filteredColliders.push(dyamicMoverResult);
                        }
                        this.colliderMatrix[currentMove.origin.x+1][currentMove.origin.y] = filteredColliders;
                        console.log(this.grid.col-1);
                        console.log(currentMove.origin.x);
                        console.log(currentMove.origin.y);
                        console.log("remaining Colliders: ");
                        console.log(this.colliderMatrix[currentMove.origin.x][currentMove.origin.y]);
                    }
                    else
                    {
                        this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = currentMove.dynamicObject.resolveMove(moveResult);
                    }                     
                }
            }

            console.log("currentColliderMatrix:");
            console.log(this.colliderMatrix[this.grid.col-1]);
        }
    }

    checkPlayerCollisionsWithDoor(collisions)
    {
        let player, door;

        for(let collider in collisions)
        {
            switch(collider.type)
            {
                case Colliders.player:
                    player = true;
                    break;
                case Colliders.door:
                    door = true;
                    break;
            }
        }

        return player && door;
    }
}