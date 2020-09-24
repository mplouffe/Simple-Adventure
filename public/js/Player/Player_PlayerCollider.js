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
    constructor() {
      this.collider = Colliders.player;      
    }

    resolveCollision(collider) {
        switch (collider) {
            case Colliders.wall:
                break;
            case Colliders.door:
                break;
        }
        console.log("Player collided with: " + collider);
    }

    resolveMove(move) {
        console.log(move);
        console.log("Player tried to move, but couldn't...");
        return this.collider;
    }
}