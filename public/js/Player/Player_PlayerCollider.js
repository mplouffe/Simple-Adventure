/* Grid Engine Bootstrap
 * Simple bootstrap file that loads and starts the engine.
 * Version: 0.1
 * Date Created: 09.03.2020
 * Last Updated: 09.03.2020
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial implementation
*/

class PlayerCollider {
    constructor(gridTransformRef) {
      this.collider = Colliders.player;
      this.gridTransformRef = gridTransformRef;  
    }

    resolveCollision(collider) {
        switch (collider) {
            case Colliders.wall:
                console.log("Player collided with wall");
                break;
            case Colliders.door:
                console.log("Player collided with door");
                break;
        }
        
        return collider;
    }

    resolveMove(moveResult) {
        if (moveResult.result)
        {
            this.gridTransformRef.move(moveResult.destination.x, moveResult.destination.y);
        }
        return null;
    }
}