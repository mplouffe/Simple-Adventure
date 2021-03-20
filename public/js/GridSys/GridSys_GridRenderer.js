/* GridSys_GridRenderer
 * The rendering component attached to a dynamic object
 * Version: 0.1
 * Date Created: 09.07.2020
 * Last Update: 03.19.2021
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation
 * 0.2 - added render flag
 */

class GridRenderer {
    constructor(color) {
        this.color = color;
        this.render = true;
    }
}