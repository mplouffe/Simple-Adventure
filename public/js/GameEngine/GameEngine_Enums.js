/* Game Engine - Enums
 * A central place to collect and initalize all the enums.
 * Version: 0.1
 * Date Created: 09.03.2020
 * Last Updated: 09.03.2020
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial implementation
*/

const Colliders = {
    player: 1,
    wall: 2,
    door: 3,
    item: 4,
    enemy: 5
}

const GameObjectComponentType = {
    renderer: 1,
    collider: 2,
}

class Enums 
{
    static Initialize() {
        Object.freeze(Colliders);
    }
}