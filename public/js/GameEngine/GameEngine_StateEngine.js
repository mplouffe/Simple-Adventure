/* Simple Adventure State Engine
 * A modular stack based State Engine for use in Simple Adventure Game.
 * Version: 0.2
 * Date Created: 07.10.2016
 * Last Update: 09.07.2020
 * 
 * History:
 * 0.1 - Initial implementation
 * 0.2 - Added coverState and removeState to encapsulate state set shut down
 * 0.3 - Converted to class
 */

class StateStack{
    constructor(initalState) {
        this.currentState = initalState;
        if (initalState === undefined) {
            this.stateStack = [];
        }
        else {
            this.stateStack = [this.currentState];
        }
    }

    // push new state onto stack
    // call cover state method to clean current statue UI
    // and save any state that needs to be saved before stashing state
    pushState(gameState) {
        if (this.currentState != null) {
            this.currentState.coverState();
        }
        this.stateStack.push(gameState);
        this.currentState = this.stateStack[this.stateStack.length - 1];
    }

    // pop current state off the stack
    // call remove state method to clean current state UI
    // and remove any other state garbage before it is trashed from the stack
    popState() {
        if (this.currentState != null) {
            this.currentState.removeState();
        }
        this.stateStack.pop();
        this.currentState = this.stateStack[this.stateStack.length - 1];
        // refresh the new current state if needed
        if (this.currentState != null && this.currentState.needsRefresh === true) {
            this.currentState.refresh();
        }
    }

    render() {
        if (this.currentState != null) {
            this.currentState.render();
        }
    }

    update() {
        if (this.currentState != null) {
            this.currentState.update();
        }
    }

    getCurrentState() {
        return this.currentState;
    }
}