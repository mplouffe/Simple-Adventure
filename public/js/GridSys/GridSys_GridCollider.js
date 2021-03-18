
class GridCollider 
{
    constructor()
    {
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
            for (let i = 0; i < collisionCallbacks.length; i++)
            {
                return collisionCallbacks[i](colliders, move);
            }
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
    }

    onPlayerCollidesDoor(colliders, move)
    {
        return { 
            origin: null,
            target: colliders,
            moveResult: new MoveResult(move.target.x, move.target.y, true)
        };
    }

    onPlayerCollidesWall(colliders, move)
    {
        return {
            origin: [{
                "type": Colliders.player,
                "entity": move.dynamicObject
            }],
            target: [{
                "type": Colliders.wall
            }],
            moveResult: new MoveResult(move.origin.x, move.origin.y, false)
        };
    }
}