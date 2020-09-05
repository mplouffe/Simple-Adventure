/* Grid Graphics Engine (GGfxEngine)
 * The graphics engine for Simple Adventure.
 * Version: 0.1
 * Date Created: 09.03.2020
 * Last Updated: 09.03.2020
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial implementation
 *          - encapsulation of original graphics engine from Simple Adventure
*/

function GGfxEngine()
{
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', 'gameCanvas');
    this.gameWindow = document.createElement('section');
    this.ui = document.createElement('p');

    this.gameWindow.appendChild(this.canvas);
    this.gameWindow.appendChild(this.ui);

    this.context = this.canvas.getContext('2d');

    document.getElementsByTagName('body')[0].appendChild(this.gameWindow);
}