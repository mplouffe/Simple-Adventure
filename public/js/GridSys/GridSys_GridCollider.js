
class GridCollider 
{
    constructor()
    {
        this.callbacks = new Map();
        this.bootstrapGridCollider();
    }

    resolveCollision(colliders)
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
                collisionCallbacks[i](colliders);
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
    }

    onPlayerCollidesDoor(colliders)
    {
        console.log("Bonked door");
    }
}