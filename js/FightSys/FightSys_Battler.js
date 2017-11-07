/* Battler Prototype
 * The base class for combatants within the Fight Engine
 * player and Enemy will inherit this framework
 * Version: 0.2
 * Date Created: 08.28.2016
 * Last Updated: 15.01.2017
 * Author: Matheu Plouffe
 *
 * History:
 * 0.1 - Created
 * 0.2 - Added comments
 */

// Constructor
function Battler(hp, mp, str, wpnStr, def, magicDef, init, battlerName){
	this.hitPoints = hp;				// health
	this.magicPoints = mp;				// mana
	this.strength = str;				// physical strength
	this.weaponStrength = wpnStr;		// weapon strength
	this.defence = def;					// physical defence
	this.magicDefence = magicDef;		// magic defence
	this.initiative = init;				// initiative
	this.isAlive = true;				// the alive state of the battler
	this.spells = [];					// array containing the spells available to the battler
	this.name = battlerName;			// name of the battler
}

// attack
Battler.prototype.attack = function(){
	return this.strength;
}

// defend
Battler.prototype.defend = function(attack){
	this.hit(attack - this.defence);
}

// hit
// used to apply damage to the battler
// checks the living state of the battler after applyign damage
Battler.prototype.hit = function(damage){
	this.hitPoints -= damage;
	if(this.hitPoints <= 0)
	{
		this.isAlive = false;
	}
}

// addSplles
// used to add spells to the array available to the battler
Battler.prototype.addSpells = function(spellArray){
	this.spells = spellArray;
}