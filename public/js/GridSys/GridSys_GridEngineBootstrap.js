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


var deltaTime = 0.0;
var gameEngine;

function load()
{
    Enums.Initialize();

    window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000/60) };
    
    gameEngine = new GameEngine();

    window.addEventListener("keydown", function(event) {
        gameEngine.inputEngine.onKeyDownEvent(event);
    });
    
    window.addEventListener("keyup", function(event) {
        gameEngine.inputEngine.onKeyUpEvent(event);
    });
	step();
}

var step = function() {
    if(!gameEngine.stopAnimating) {
        gameEngine.step();
        window.requestAnimationFrame(step);
    }
}

document.addEventListener("DOMContentLoaded", load, false);