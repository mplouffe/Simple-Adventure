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
        this.resetColliderMatrix();
        this.gridCollider = gridCollider;
    }

    buildRoom(currentRoom) {
        this.resetColliderMatrix();
        for (let i = 0; i < currentRoom.doors.length; i++) {
            let currentDoor = currentRoom.doors[i];
            for (let j = 0; j < currentDoor.origins.length; j++) {
                let xMax = currentDoor.origins[j].x + currentDoor.dimension.w;
                let yMax = currentDoor.origins[j].y + currentDoor.dimension.l;
                for (let x = currentDoor.origins[j].x; x < xMax; x++) {
                    for (let y = currentDoor.origins[j].y; y < yMax; y++) {
                        this.colliderMatrix[x][y] = [{ 
                                                        "type": Colliders.door,
                                                        "entity": currentDoor
                                                    }];
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
                        this.colliderMatrix[x][y] = [{
                                                        "type": Colliders.wall
                                                    }];
                    }
                }
            }
        }
    }

    resetColliderMatrix()
    {
        this.colliderMatrix = [];
        for (let i = 0; i < this.grid.col; i++) {
            this.colliderMatrix[i] = [];
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
                    let door = collisions.filter(collider => collider.type == Colliders.door)[0];
                    overworldState.nextRoom = door.entity.exitTo;

                    if (currentMove.target.x < 0)
                    {
                        moveResult = new MoveResult(this.grid.col-1, currentMove.target.y, true);
                    }
                    else if (currentMove.target.x >= this.grid.col)
                    {
                        moveResult = new MoveResult(0, currentMove.target.y, true);
                    }
                    else if (currentMove.target.y < 0)
                    {
                        moveResult = new MoveResult(currentMove.target.x, this.grid.row-1, true);
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
                    collisions.push({ 
                        "type": currentMove.dynamicObject.collider, 
                        "entity": currentMove.dynamicObject
                    });
                    let collisionResults = this.gridCollider.resolveCollision(collisions, currentMove);
                    this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = collisionResults.origin;
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = collisionResults.target;
                    currentMove.dynamicObject.resolveMove(collisionResults.moveResult);
                }
                else
                {
                    // resolve move into empty square
                    let moveResult = new MoveResult(currentMove.target.x, currentMove.target.y, true);
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = [{ 
                                                                                        "type": currentMove.dynamicObject.collider, 
                                                                                        "entity": currentMove.dynamicObject
                                                                                    }];
                    // get make sure we replace collider in square moved off of
                    let currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                    if (currentColliders != null && currentColliders.length > 1)
                    {
                        let filteredColliders = [];
                        for(let i = 0; i < currentColliders.length; i++)
                        {
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
                        this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = filteredColliders;
                    }
                    else
                    {
                        let moveResolution = currentMove.dynamicObject.resolveMove(moveResult);
                        if (moveResolution != null)
                        {
                            this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = moveResolution;
                        }
                        else
                        {
                            delete this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                        }
                    }                     
                }
            }
        }
    }

    checkPlayerCollisionsWithDoor(collisions)
    {
        let player, door;

        for(let i = 0; i < collisions.length; i++)
        {
            let colliderType = collisions[i].type;
            switch(colliderType)
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

    insertPlayer(player)
    {
        let currentColliders = this.colliderMatrix[player.gridTransform.location.x][player.gridTransform.location.y];
        if (currentColliders == undefined)
        {
            this.colliderMatrix[player.gridTransform.location.x][player.gridTransform.location.y] = [{
                type: player.gridCollider.collider,
                entity: player
            }];
        }
        else
        {
            this.colliderMatrix[player.gridTransform.location.x][player.gridTransform.location.y].push({
                type: player.gridCollider.collider,
                entity: player
            });
        }
    }
}