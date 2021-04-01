/* Simple Adventure Grid Collider
 * Callback system used to resolve object collision
 * Version: 0.1
 * Date Created: 03.13.2021
 * Last Update: 03.17.2021
 * Author: Matheu Plouffe
 * 
 * History
 * 0.1 - Original version
 */


class GridCollider 
{
    constructor(stateStack)
    {
        this.gameEngineStateStack = stateStack;
        this.callbacks = new Map();
        this.bootstrapGridCollider();
    }

    resolveCollision(colliders, move)
    {
        let colliderTypes = [];
        for (let i = 0; i < colliders.length; i++)
        {
            colliderTypes[i] = colliders[i].type;
        }
        let sortedColliderTypes = colliderTypes
                                .filter(Boolean)
                                .sort()
                                .join('');
        if (this.callbacks.has(sortedColliderTypes))
        {
            let collisionCallbacks = this.callbacks.get(sortedColliderTypes);
            return collisionCallbacks[0](colliders, move);
        }
        else
        {
            console.log("Could not find collision callback for provided collider types: " + sortedColliderTypes);
        }
    }

    addCollisionCallback(colliderTypes, callback)
    {
        let sortedColliders = colliderTypes
                                .filter(Boolean)
                                .sort()
                                .join('');
        
        let collisionCallbacks;
        if (this.callbacks.has(sortedColliders))
        {
            collisionCallbacks = this.callbacks.get(sortedColliders);
            collisionCallbacks[collisionCallbacks.length] = callback;
        }
        else
        {
            collisionCallbacks = [callback];
        }
        this.callbacks.set(sortedColliders, collisionCallbacks);

    }

    bootstrapGridCollider()
    {
        let colliderTypes = [Colliders.player, Colliders.door].sort().join('');
        this.callbacks.set(colliderTypes, [this.onPlayerCollidesDoor]);
        colliderTypes = [Colliders.player, Colliders.wall].sort().join('');
        this.callbacks.set(colliderTypes, [this.onPlayerCollidesWall]);
        colliderTypes = [Colliders.player, Colliders.item].sort().join('');
        this.callbacks.set(colliderTypes, [this.onPlayerCollidesItem]);
    }

    onPlayerCollidesDoor(colliders, move)
    {
        let door = colliders.filter(collider => collider.type === Colliders.door)[0].entity;
        let player = colliders.filter(collider => collider.type === Colliders.player)[0].entity;

        let isBlocked = false;
        if (door.locked)
        {
            if (player.checkForKey(door))
            {
                door.locked = false;
                door.gridRenderer.render = false;        
            }
            else
            {
                isBlocked = true;
            }
        }

        if (isBlocked)
        {
            return {
                origin: [{
                    "type": Colliders.player,
                    "entity": move.dynamicObject
                }],
                target: [{
                    "type": Colliders.door,
                    "entity": door
                }],
                moveResult: new MoveResult(move.origin.x, move.origin.y, false)
            };
        }
        else
        {
            return { 
                origin: null,
                target: colliders,
                moveResult: new MoveResult(move.target.x, move.target.y, true)
            };
        }
    }

    onPlayerCollidesWall(colliders, move)
    {
        let remainingColliders = colliders.filter(collider => collider.type !== Colliders.wall);
        return {
            origin: remainingColliders,
            target: [{
                "type": Colliders.wall
            }],
            moveResult: new MoveResult(move.origin.x, move.origin.y, false)
        };
    }

    onPlayerCollidesItem(colliders, move)
    {
        let item = colliders.filter(collider => collider.type === Colliders.item)[0].entity;
        let player = colliders.filter(collider => collider.type === Colliders.player)[0].entity;

        switch(item.type)
        {
            case "key":
                player.addKeyToInventory(item);
                item.gridRenderer.render = false;
                item.pickedUp = true;
                break;
            case "victory":
                player.addItemToInventory(item);
                item.gridRenderer.render = false;
                item.pickedUp = true;
                break;
        }

        if (item.pickedUp)
        {
            return { 
                origin: null,
                target: [{
                    "type": Colliders.player,
                    "entity": move.dynamicObject
                }],
                moveResult: new MoveResult(move.target.x, move.target.y, true)
            };
        }
        else
        {
            return {
                origin: null,
                target: colliders,
                moveResult: new MoveResult(move.target.x, move.target.y, true)
            }
        }
    }

    onPlayerCollidesEnemy(colliders, move)
    {
        let enemy = colliders.filter(collider => collider.type === Colliders.enemy)[0].entity;

        
    }
}