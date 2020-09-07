/* Simple Adventure Grid System - Movement Grid
* A wrapper around the grid base class with movement utility functions
* Version: 0.1
* Date Created: 09.07.2020
* Last Updated: 09.07.2020
* Author: Matheu Plouffe
*
* History
* 0.1 - Initial implementation
*/

class MovementGrid
{
    constructor(basisGrid) {
        this.grid = basisGrid;
    }

    resolveMoves(allMoves) {
        if (allMoves.length == 0)
        {
            return;
        }

        let sortedMoves = allMoves
                            .filter(Boolean)
                            .sort((a, b) => {
                                if (a.initiative < b.initiative) return 1;
                                else if (a.initiative > b.initiative) return -1;
                                else return 0;
                            });

        for (let i = 0; i < sortedMoves.length; i++)
        {
            
        }
    }

    checkForCollisions(origin, destination) {
        return [];
        // check for and return an array of all objects collided with along a raycast
        // from the origin to the destination (inclusive)
    }
}