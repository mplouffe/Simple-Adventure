/* Simple Adventure State Engine
 * A modular stack based State Engine for use in Simple Adventure Game.
 * Version: 0.1
 * Date Created: 07.10.2016
 * Last Update: 08.12.2020
 */


 
 function StateStack(initalState){
 	this.currentState = initalState;
 	if(initalState === undefined)
 	{
 		this.stateStack = [];
    }
    else
 	{
	 	this.stateStack = [this.currentState]; 		
 	}
 }

 // push new state onto stack
 // call cover state method to clean current statue UI
 // and save any state that needs to be saved before stashing state
 StateStack.prototype.pushState = function(gameState){
    if (!(this.currentState === undefined))
    {
        this.currentState.coverState();
    }
 	this.stateStack.push(gameState);
 	this.currentState = this.stateStack[this.stateStack.length - 1];
 }

 // pop current state off the stack
 // call remove state method to clean current state UI
 // and remove any other state garbage before it is trashed from the stack
 StateStack.prototype.popState = function(){
    if (!(this.currentState === undefined))
    {
        this.currentState.removeState();
    }
 	this.stateStack.pop();
     this.currentState = this.stateStack[this.stateStack.length - 1];
    // refresh the new current state if needed
 	if(this.currentState != null && this.currentState.needsRefresh === true)
 	{
 		this.currentState.refresh();
 	}
 }

 StateStack.prototype.render = function(){
 	if(this.currentState != null) {
	 	this.currentState.render();
	 }
 }

 StateStack.prototype.update = function(){
 	if(this.currentState != null) {
	 	this.currentState.update();
	}
 }

 StateStack.prototype.getCurrentState = function(){
 	return this.currentState;
 }