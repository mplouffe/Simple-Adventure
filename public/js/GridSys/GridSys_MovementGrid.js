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

        currentRoom.items.filter(currentItem => !currentItem.pickedUp).forEach((currentItem) => {
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
            if (this.movingOutOfBounds(currentMove))
            {
                let moveResult = this.resolveOutOfBoundsMove(currentMove, overworldState);
                currentMove.dynamicObject.gridCollider.resolveMove(moveResult);
            }
            else
            {
                let collisions = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
                console.log("Collisions:");
                console.log(collisions);             
                if (Boolean(collisions))
                {
                    this.resolveCollisions(currentMove, collisions);
                }
                else
                {
                    this.resolveNonCollisionMove(currentMove);
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

    resolveOutOfBoundsMove(currentMove, overworldState)
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

        return moveResult;
    }

    movingOutOfBounds(currentMove)
    {
        return currentMove.target.x < 0 || 
        currentMove.target.x >= this.grid.col ||
        currentMove.target.y < 0 || 
        currentMove.target.y >= this.grid.row;
    }

    resolveCollisions(currentMove, collisions)
    {
        console.log("resolveCollisions-+-+-+");
        // resolve collisions
        let currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
        console.log("oritin start:");
        console.log(currentColliders);
        currentColliders = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
        console.log("target start:");
        console.log(currentColliders);

        collisions.push({ 
            "type": currentMove.dynamicObject.gridCollider.collider, 
            "entity": currentMove.dynamicObject
        });
        console.log("Collisions: ");
        console.log(collisions);
        let origin = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
        console.log("Origin colliders: ");
        console.log(origin);
        let collisionResults = this.gridCollider.resolveCollision(collisions, currentMove);
        console.log("collsion results: ");
        console.log(collisionResults);
        let dynamicMoveResult = currentMove.dynamicObject.gridCollider.resolveMove(collisionResults.moveResult);
        console.log("Dynamic result: ");
        console.log(dynamicMoveResult);
        let remainingColliders = origin.filter(collider => collider.type !== currentMove.dynamicObject.gridCollider.collider);
        console.log("remainingColliders: ");
        console.log(remainingColliders);
        if (dynamicMoveResult !== null)
        {
            remainingColliders.push(dynamicMoveResult);
        }
        
        if (collisionResults.origin == null)
        {
            if (remainingColliders.length == 0)
            {
                delete this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
            }
            else
            {
                this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = remainingColliders;
            }
        }
        else
        {
            if (remainingColliders.length == 0)
            {
                this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = collisionResults.origin;
            }
            else
            {
                collisionResults.origin.forEach(collider => remainingColliders.push(collider));
                this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = remainingColliders;   
            }
        }

        if (collisionResults.target == null)
        {
            delete this.colliderMatrix[currentMove.target.x][currentMove.target.y];
        }
        else
        {
            this.colliderMatrix[currentMove.target.x][currentMove.target.y] = collisionResults.target;
        }

        
        currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
        console.log("originresult:");
        console.log(currentColliders);
        currentColliders = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
        console.log("targetresult:");
        console.log(currentColliders);
        console.log("end resolveCollisions-+-+-+")
    }

    resolveNonCollisionMove(currentMove)
    {
        console.log("resolveNonCollisionMove-+-+-+");
        let currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
        console.log("oritin start:");
        console.log(currentColliders);
        currentColliders = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
        console.log("target start:");
        console.log(currentColliders);
        console.log("currentMove");
        console.log(currentMove);
        // resolve move into empty square
        let moveResult = new MoveResult(currentMove.target.x, currentMove.target.y, true);

        this.colliderMatrix[currentMove.target.x][currentMove.target.y] = [{ 
            "type": currentMove.dynamicObject.gridCollider.collider, 
            "entity": currentMove.dynamicObject
        }];

        let dyamicMoverResult = currentMove.dynamicObject.gridCollider.resolveMove(moveResult);
        currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
        console.log("currentColliders");
        console.log(currentColliders);
        console.log("dynamicMoverResult:")
        console.log(dyamicMoverResult);
        if (currentColliders != null && currentColliders.length > 1)
        {
            // remove player collider from square moved off of
            // leaving the rest in place
            let filteredColliders = currentColliders.filter(collider => collider.type != currentMove.dynamicObject.gridCollider.collider);

            if (dyamicMoverResult != null)
            {
                filteredColliders.push(dyamicMoverResult);
            }
            this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = filteredColliders;
        }
        else
        {
            // clean up and leave behind the result of the move resolution
            if (dyamicMoverResult != null)
            {
                this.colliderMatrix[currentMove.origin.x][currentMove.origin.y] = dynamicMoverResult;
            }
            else
            {
                delete this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
            }
        }

        currentColliders = this.colliderMatrix[currentMove.origin.x][currentMove.origin.y];
        console.log("originresult:");
        console.log(currentColliders);
        currentColliders = this.colliderMatrix[currentMove.target.x][currentMove.target.y];
        console.log("targetresult:");
        console.log(currentColliders);
        console.log("end resolveNonCollisionMove-+-+-+");
    }                     
}