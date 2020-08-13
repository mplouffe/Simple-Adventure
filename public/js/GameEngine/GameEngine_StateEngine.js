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

 StateStack.prototype.pushState = function(gameState){
 	this.stateStack.push(gameState);
 	this.currentState = this.stateStack[this.stateStack.length - 1];
 }

 StateStack.prototype.popState = function(){
 	this.stateStack.pop();
 	this.currentState = this.stateStack[this.stateStack.length - 1];
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