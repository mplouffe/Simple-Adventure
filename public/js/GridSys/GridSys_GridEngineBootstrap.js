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

function load()
{
    var gameEngine = new GameEngine();
	gameEngine.step();
}

document.addEventListener("DOMContentLoaded", load, false);