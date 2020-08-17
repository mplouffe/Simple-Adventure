/* Random Encounter System
 * A random encounter system used for the Simple Adventure Game
 * Version: 0.1
 * Date Created: 07.1.2016
 * Last Update: 07.01.2016
 * Author: Matheu Plouffe
 */

 /* RANDOM ENCOUNTER ENGINE
  * Was supposed to be designed so that every min 8 max 32 steps
  * BUT right now it increments by the rndEncounterFactor each UPDATE instead of each step
  * even if the hero never moves, random encounters will trigger
  * maybe not bad, but if so would probably have to change the update frequency to something
  * more reasonable
  */
 function RndEncounterEngine()
 {
 	this.roomMonsterList = [];
 	this.nextEncounter = resetRndEncounterCounter();
    this.currentActiveMonster;
    this.steppingTime = 0.0;
    this.nextEncounter = resetRndEncounterCounter();
 }

/* Problem! this is being done each update instead of each 'step'
 */
RndEncounterEngine.prototype.addSteps = function()
{
	if(this.roomMonsterList.length > 0)
	{
        this.steppingTime += deltaTime / 1000;
        if (this.steppingTime >= this.nextEncounter) {
            this.steppingTime = 0.0;
			this.nextEncounter = resetRndEncounterCounter();
			this.triggerRndEncounter();
        }
	}
}

RndEncounterEngine.prototype.triggerRndEncounter = function()
{
	let encounterMonster = Math.floor(Math.random() * this.roomMonsterList.length);
	this.currentActiveMonster = encounterMonster;
	stateMachine.pushState(new FightState(gameWindow, canvas, this.roomMonsterList[encounterMonster]));
}

RndEncounterEngine.prototype.addMonsterToList = function(monsterToAdd)
{
	this.roomMonsterList.push(monsterToAdd);
}

RndEncounterEngine.prototype.removeCurrentMonsterFromList = function()
{
	this.roomMonsterList.splice(this.currentActiveMonster, 1);
	let monsterToRemove = levels[currentLevel].getElementsByTagName('monsters')[this.currentActiveMonster];
	monsterToRemove.parentNode.removeChild(monsterToRemove);
}

function resetRndEncounterCounter()
{
	let max = 2;
	let min = 8;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}