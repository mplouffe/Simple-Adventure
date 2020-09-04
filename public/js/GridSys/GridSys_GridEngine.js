/* Simple Adventure Grid Engine
 * An alteration of the game engine to use a grid based level building system.
 * Version: 0.1
 * Date Created: 08.23.2020
 * Last Updated: 08.23.2020
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial implementation
*/

function GameEngine()
{
    this.gfxEngine = new GGfxEngine();
    this.inputEngine = new InputEngine();
    this.inputEngine.keyDown = [];
	this.player = new Player(0, 10, 20, "Dude!!!");
    this.stateMachine = new StateStack(new OverWorldState(this.gfxEngine, this.inputEngine, this.player));

	this.animate = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };
	this.stopAnimating = false;
    this.start = Date.now();
    this.lastTick = start;
}

GameEngine.prototype.step = function(){
	if(!this.stopAnimating) {
		this.stateMachine.update();
        this.stateMachine.render();
        let currentTick = Date.now();
        this.deltaTime = currentTick - this.lastTick;
        this.lastTick = currentTick;
		this.animate(this.step);
	}
}