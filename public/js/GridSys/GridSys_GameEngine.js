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

class GameEngine {
    constructor() {
        this.gfxEngine = new GGfxEngine();
        this.inputEngine = new InputEngine();
        this.player = new Player(0, 10, 20, "Dude!!!", this.inputEngine);
        this.stateFactory = new MenuStateFactory(this.gfxEngine, this.inputEngine);
        
        this.stateMachine = new StateStack(this.stateFactory.getEndMenuState());
        this.stateMachine.pushState(new OverWorldState(this.gfxEngine, this.player));
        this.stateMachine.pushState(this.stateFactory.getStartMenuState());
        this.changeState = false;
        this.start = Date.now();
        this.lastTick = this.start;
    }

    step() {
        if(!this.changeState) {
            this.changeState = this.stateMachine.update();
            this.stateMachine.render();
        }
        else
        {
            let stateResult = this.stateMachine.getStateResult();
            switch(stateResult)
            {
                case StateResult.remove:
                    this.stateMachine.popState();
                    this.changeState = false;
                    break;
                case StateResult.empty:
                    // TODO: What to do with an emtpy state machine
                    break;
            }

        }
        let currentTick = Date.now();
        deltaTime = currentTick - this.lastTick;
        this.lastTick = currentTick;
    }
}
