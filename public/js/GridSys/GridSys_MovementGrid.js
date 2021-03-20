/* Simple Adventure Grid System - Movement Grid
* A wrapper around the grid base class with movement utility functions
* Version: 0.1
* Date Created: 09.07.2020
* Last Updated: 03.17.2021
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
        currentRoom.doors.forEach((currentDoor) => {
            let xMax = currentDoor.origins.x + currentDoor.dimension.w;
            let yMax = currentDoor.origins.y + currentDoor.dimension.l;
            for (let x = currentDoor.origins.x; x < xMax; x++) {
                for (let y = currentDoor.origins.y; y < yMax; y++) {
                    this.colliderMatrix[x][y] = [{ 
                                                    "type": Colliders.door,
                                                    "entity": currentDoor
                                                }];
                }
            }
        });

        currentRoom.walls.forEach((currentWall) => {
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
        });

        currentRoom.items.forEach((currentItem) => {
            this.colliderMatrix[currentItem.itemLocation.x][currentItem.itemLocation.y] = [{ 
                "type": Colliders.item,
                "entity": currentItem
            }];
        });
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
            // if trying to move outside the bounds of the level
            if (currentMove.target.x < 0 || 
                currentMove.target.x >= this.grid.col ||
                currentMove.target.y < 0 || 
                currentMove.target.y >= this.grid.row )
            {
                let moveResult;
                let collisions = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                if (this.checkPlayerCollisionsWithDoor(collisions))
                {
                    // set flags to load next level
                    overworldState.shouldLoadLevel = true;
                    let door = collisions.filter(collider => collider.type == Colliders.door)[0];
                    overworldState.nextRoom = door.entity.exitTo;

                    // position the player depending on where they exited
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
                    // prevent entity from moving outside the bounds of the level
                    moveResult = new MoveResult(currentMove.origin.x,
                        currentMove.origin.y,
                        false);
                }
                currentMove.dynamicObject.gridCollider.resolveMove(moveResult);
            }
            else
            {
                let collisions = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
                if (Boolean(collisions))
                {
                    // resolve collisions
                    collisions.push({ 
                        "type": currentMove.dynamicObject.gridCollider.collider, 
                        "entity": currentMove.dynamicObject
                    });
                    let collisionResults = this.gridCollider.resolveCollision(collisions, currentMove);
                    if (collisionResults.origin == null)
                    {
                        delete this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                    }
                    else
                    {
                        this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = collisionResults.origin;
                    }

                    if (collisionResults.target == null)
                    {
                        delete this.colliderMatrix[currentMove.target.x][currentMove.target.y];
                    }
                    else
                    {
                        this.colliderMatrix[currentMove.target.x][currentMove.target.y] = collisionResults.target;
                    }
                    currentMove.dynamicObject.gridCollider.resolveMove(collisionResults.moveResult);
                }
                else
                {
                    // resolve move into empty square
                    let moveResult = new MoveResult(currentMove.target.x, currentMove.target.y, true);
                    this.colliderMatrix[currentMove.target.x][currentMove.target.y] = [{ 
                                                                                        "type": currentMove.dynamicObject.collider, 
                                                                                        "entity": currentMove.dynamicObject
                                                                                    }];

                    let currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
                    if (currentColliders != null && currentColliders.length > 1)
                    {
                        // remove player collider from square moved off of
                        // leaving the rest in place
                        let filteredColliders = currentColliders.filter(collider => collider.type != currentMove.dynamicObject.gridCollider.collider);
                        let dyamicMoverResult = currentMove.dynamicObject.gridCollider.resolveMove(moveResult);
                        if (dyamicMoverResult != null)
                        {
                            filteredColliders.push(dyamicMoverResult);
                        }
                        this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = filteredColliders;
                    }
                    else
                    {
                        // clean up and leave behind the result of the move resolution
                        let moveResolution = currentMove.dynamicObject.gridCollider.resolveMove(moveResult);
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
        // if current collisions includes player and door then player is standing on a door
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
        // insert the player into the collider matrix
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