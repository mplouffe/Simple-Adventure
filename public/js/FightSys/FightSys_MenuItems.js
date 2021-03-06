/* Menu Items
 * definitons for menu items
 * each menu item will be it's own object
 * Version: 0.3
 * Date Created: 08.27.2016
 * Last Update: 30.03.2020
 * Author: Matheu Plouffe
 *
 * History:
 * 0.1 - Written
 * 0.2 - added comments
 * 0.3 - changed to classes
 */

// Attack
// just holds a textTag that is used to write the action out to the inputMenu
class Attack
{
    constructor() {
        this.textTag = "ATTACK";
    }

    picked(menuState) {
        // turn off the inputMenus
        fi.turnOffInputMenus();
        // calls the player attack method of the dm
        // can't remember why I'm passing in the menuState
        dm.playerAttack(menuState);
    }
}

// spellMenuItem
// just holds a textTag that is used to write the action out to the inputMenu
class SpellMenuItem
{
    constructor() {
        this.textTag = "SPELL";
    }

    // picked
    // the action for when a spellMenu
    picked(menuState) {
        // create an array of spellMenuItems
        let spellMenuItems = [];
        // for each of the spells in the player's spell
        for(let i = 0; i < dm.player.spells.length; i++)
        {
            // push the spell into the array of spell menuItems
            spellMenuItems.push(dm.player.spells[i]);
        }
        // create a new rightMenuState
        let newState = new RightMenuState();
        // set the menuItemsArray to the spellMenuItems array
        newState.setMenuItemsArray(spellMenuItems);
        // set a reference to the menuState's stateStack
        newState.setStateStack(menuState.stateStack);
        // push this state onto the stateStack
        menuState.stateStack.pushState(newState);
    }
}


// spell
// the spell object
class Spell
{
    constructor(name, kind, ebv, mp) {
        this.textTag = name;			// the textTag name of the tag
        this.kind = kind;				// the kind of the spell
        this.effectBaseFactor = ebv;	// the effect base factor
        this.mp = mp;					// how much mp this spell costs
    }

    // picked
    // the action for when a spell is picked
    picked(menuState) {
        // turn off the input menus
        fi.turnOffInputMenus();
        // call spellCast on the dm
        dm.spellCast(this, menuState);
    }
}

// ItemMenuItem
// just holds a textTag that is used to write the action out to the inputMenu
class ItemMenuItem
{
    constructor() {
        this.textTag = "ITEM";
    }

    // picked
    // the action for when an item is picked
    picked() {
        // doesn't do anything right now
        // TODO: implement items
        console.log("item Picked");
    }
}


// parry
// just holds a textTag that is used to write the action out to the inputMenu
class Parry
{
    constructor() {
        this.textTag = "PARRY";
    }

    // picked
    // the action for when an item is picked
    picked() {
        // doesn't do anything right now
        // TODO: implement this function
        console.log("parry picked");
    }
}


// run
// just holds a textTag that is used to write the action out to the inputMenu
class Run
{
    constructor() {
        this.textTag = "RUN";
    }

    // picked
    // the action for when run is picked
    picked() {
        // turn off the input menus
        fi.turnOffInputMenus();
        // call the playerRun on the dm
        dm.playerRun();
    }
}


// draw
// just holds the textTag that is used to write the action out to the inputMenu
class Draw
{
    constructor() {
        this.textTag = "DRAW";
    }

    // picked
    // the action for when the draw is picked
    picked() {
        // turn off the inputMenus
        fi.turnOffInputMenus();
        // call the playerChannel function on the dm
        dm.playerChannel();
    }
}