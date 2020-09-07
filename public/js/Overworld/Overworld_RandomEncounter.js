/* Random Encounter System
 * A random encounter system used for the Simple Adventure Game
 * Version: 0.2
 * Date Created: 07.1.2016
 * Last Update: 09.07.2020
 * Author: Matheu Plouffe
 * 
 * History:
 * 0.1 - Initial implementation (with improper stepping implementation)
 * 0.2 - Changed over to grid based stepping implemenation in class
 * 
 */

class RndEncounterEngine
{
    constructor(min, max) {
        this.stepThresholds = { min: min, max: max };
        this.roomMonsterList = [];
        this.currentActiveMonster;
        this.stepsSinceLastEncounter = 0;
        this.nextEncounter = this.resetRndEncounterCounter();
        this.triggerFight = false;
        this.fightState = {};
    }

    addSteps(numberOfSteps) {
        if (this.roomMonsterList.length > 0) {
            this.stepsSinceLastEncounter += numberOfSteps;
            if (this.stepsSinceLastEncounter >= this.nextEncounter) {
                this.stepsSinceLastEncounter = 0;
                this.nextEncounter = resetRndEncounterCounter();
                this.triggerRndEncounter();
            }
        }
    }

    triggerRndEncounter() {
        let randomMonsterIndex = Math.floor(Math.random() * this.roomMonsterList.length);
        this.fightState.currentActiveMonsterIndex = randomMonsterIndex;
        this.fightState.currentMonster = this.roomMonsterList[randomMonsterIndex];
    }

    addMonsterToList(monsterToAdd) {
        this.roomMonsterList.push(monsterToAdd);
    }

    removeCurrentMonsterFromList() {
        this.roomMonsterList.splice(this.fightState.currentActiveMonsterIndex, 1);
    }

    resetRndEncounterCounter() {
        return Math.floor(Math.random() * (this.stepThresholds.max - this.stepThresholds.min + 1)) + this.stepThresholds.min;
    }
}