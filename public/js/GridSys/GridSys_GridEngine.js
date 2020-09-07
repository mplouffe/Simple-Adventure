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

// TODO: Not these big dirty global vars :p

class GameEngine {
    constructor() {
        this.gfxEngine = new GGfxEngine();
        this.inputEngine = new InputEngine();
        this.player = new Player(0, 10, 20, "Dude!!!", this.inputEngine);
        this.stateMachine = new StateStack(new OverWorldState(this.gfxEngine, this.player));
        this.stopAnimating = false;
        this.start = Date.now();
        this.lastTick = this.start;
    }

    step() {
        if(!this.stopAnimating) {
            this.stateMachine.update();
            this.stateMachine.render();
            let currentTick = Date.now();
            deltaTime = currentTick - this.lastTick;
            this.lastTick = currentTick;
        }
    }
}
