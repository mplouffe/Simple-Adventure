/* DUNGEON MASTER
 * Version: 0.4
 * Date Created: 07.01.2016
 * Last Updated: 30.03.2020
 * Author: Matheu Plouffe
 * 0.2 - trasnferred all DungeonMaster elements to their own file
 * 0.3 - added comments
 * 0.4 - changed to a class
 */


class DungeonMaster
{
    constructor(player, enemy, stateStack) {
        this.payerParryFlag = false;			// boolean of wether the player is parrying
        this.enemyParryFlag = false;			// boolean of wether the enemy is parrying
        this.enemyActed = false;				// boolean of if the enemy has acted
        this.playerActed = false;				// boolean of if the palyer has acted
        this.player = player;					// refernce to the player object passed in
        this.enemy = enemy;						// reference to the enemy object passed in
        this.stateStack = stateStack;			// a reference to the state stack passed in
        this.playerRan = false;					// boolean of wether the player has successfully ran away from the battle
    }

    // playerAttack
    // calculates the results of a player attacking the enemy
    playerAttack(menuState) {
        // an array that will hold the text output that results from the attack action
        let outputRoll = [];
        // get the value of the player's attack by calling the attack function of the player reference
        let playerAttackDamage = this.player.attack();	
        // add the player attacking text to the outputRoll
        outputRoll[outputRoll.length] = this.player.name + " attacks!!!";

        // if the enemy is parrying
        if(this.enemyParryFlag)
        {
            // modify damage dealt based on the enemy parrying
            playerAttackDamage = Math.Floor(playerAttackDamage / 2);
        }
        // deal the damage to the enemy
        this.enemy.hit(playerAttackDamage);
        // add the damage being dealt to the outputRoll
        outputRoll[outputRoll.length] = "You deal " + playerAttackDamage + " damage to the " + this.enemy.name + ".";
        // TODO: right now the damage dealt is unmodified by the enemy's attributes other than by the parry flag
        // all enemies will be dealt the same damage, regardless of level or any other factors
        // make this more robust and include other factors in the damage calculation

        // check to see if the enemy has died
        if(!this.enemy.isAlive)
        {
            // add the defeated enemy text to the output roll
            outputRoll[outputRoll.length] = "You have done well in defeating the " + this.enemy.name + "!";
            // add the experience and gold gained text to the output roll
            // TODO: both values (exprience and gold) appear as undefined
            // TODO: the '<' briefly appears in the text output, should try to fix that
            // TODO: these values are not being tracked or added to the player in any way
            outputRoll[outputRoll.length] = "You gain " + this.enemy.experience + " EXP.<br>You gain " + this.enemy.goldEarned + " gold.";
            // remove the defeated monster from the array of monsters in the current level
            currentLevelRndEncounterEngine.removeCurrentMonsterFromList();
        }

        // create a new scrollTextState with the outputRoll
        let newState = new ScrollTextState(outputRoll);
        // set the newState's stateStack to the menuState's state stack
        newState.setStateStack(menuState.stateStack);
        // pop the menu state off the menuState state stack
        menuState.stateStack.popState(menuState);
        // push the newState onto the state stack
        menuState.stateStack.pushState(newState);
        // start the enemy blinking
        fi.blinkEnemy = true;
    }

    // spellCast
    // calculates the result of the player casting a spell
    // TODO: this is bad design. This method has to hold the logic of all the spells in the game
    // each spell should hold it's own logic
    // at most this method shold just cause the logic to be executed 
    spellCast(spell, menuState)
    {
        // create an array to hold the output text
        let outputRoll = [];
        // if the player has enough mp to cast the spell
        if(this.player.magicPoints >= spell.mp)
        {
            // if the spell is a damage spell
            if(spell.kind == "damage")
            {
                // add the spell cast text to the output roll
                outputRoll[outputRoll.length] = this.player.name + " casts the spell of HURT!";
                // calculate the damage dealt by the spell
                let magicDamage = Math.floor((Math.random() * 15) + 1) + spell.effectBaseFactor;
                // deal the magic damage to the enemy
                this.enemy.hit(magicDamage);
                // TODO: like the physical attack, this has no
                // add the spell damage being dealt text to the output roll
                outputRoll[outputRoll.length] = "The " + this.enemy.name + " is hit for " + magicDamage + " damage.";
                // deduct the spell's mp from the player's magic points
                this.player.magicPoints -= spell.mp;
                // turn on the blinkEnemy
                fi.blinkEnemy = true;

                // check if the enemy has died
                if(!this.enemy.isAlive)
                {
                    // add the killed enemy text to the roll
                    outputRoll[outputRoll.length] = "You have done well in defeating the " + this.enemy.name + "!";
                    // add the exprience and gold gained text to the roll
                    outputRoll[outputRoll.length] = "You gain " + this.enemy.experience + " EXP.<br>You gain " + this.enemy.goldEarned + " gold.";
                    // remove the monster from the list
                    currentLevelRndEncounterEngine.removeCurrentMonsterFromList();
                    // TODO: this is the same as when the enemy dies via attacks
                    // refactor this into it's own method
                }
            } 
            // if the spell is a heal spell
            else if(spell.kind == "heal")
            {
                // add the spell heal text to the roll
                outputRoll[outputRoll.length] = this.player.name + " casts the spell of HEAL!";
                // calculate the healing done by the spell
                let magicHeal = Math.floor((Math.random() * 15) + 1) + spell.effectBaseFactor;
                // add the text of the amount the player got healed to the text roll
                outputRoll[outputRoll.length] = "You regain " + magicHeal + " hit points.";
                // heal the player by the amount
                this.player.hit(-magicHeal);
                // subtract the mp from the player's mp
                this.player.magicPoints -= spell.mp;
            }
            // update the fight UI
            fi.fightWindowUIP.innerHTML = 'Health: ' + player.playerBattler.hitPoints + ' Mana: ' + player.playerBattler.magicPoints + ' Score: ' + player.score;
        }
        // if the player doesn't have the mana to cast the spell
        else
        {
            // add the spell fail text to the roll
            outputRoll[outputRoll.length] = this.player.name + " tries to draw upon the forces of magic...";
            outputRoll[outputRoll.length] = "But the spell fizzles out...";
            // TODO: this is kind of a weak way of handling this
            // should probably put in some check that determines if the player has the available mana to cast the spell
            // rather than just wasting their action
        }

        // create a new scrollTextState with the output roll
        let newState = new ScrollTextState(outputRoll);
        // add a reference to the state stack to the new scrollTextState
        newState.setStateStack(menuState.stateStack);
        // pop the menu state off the stack
        menuState.stateStack.popState(menuState);
        // push the new scrollTextState onto the stack
        menuState.stateStack.pushState(newState);
    }

    // getPlayerInput
    // creates the menu state and sets it up to get input from the player
    getPlayerInput()
    {
        // set the playerActed to true (which it will be once this state finishes it's work)
        this.playerActed = true;
        // create a new LeftMenuState
        let newState = new LeftMenuState();
        // create an array of the basic menu options
        let menuItemArray = [new Attack(), new SpellMenuItem(), new Draw(), new Run()];
        // add the basic menu options to the LeftMenuState
        newState.setMenuItemsArray(menuItemArray);
        // pas a reference of the stateStack to the new state
        newState.setStateStack(this.stateStack);
        // push the menu state onto the state stack
        this.stateStack.pushState(newState);
    }


    // getEnemyInput
    // used to calculate the enemy's action during a battle
    // TODO: right now this is super basic and just assumes the enemy will attack each time
    // should modify it to choose a weighted random action based on an array of actions that the enemy carries
    // that way different enemies will act differently
    getEnemyInput() {
        // set the enemyActed to true (which it will be once this method resolves)
        this.enemyActed = true;
        // create a new outputRoll
        let outputRoll = [];
        // get the base damage that will be dealt by the enemy
        let enemyAttackDamage = this.enemy.attack();
        // add the basic attack text to the outputRoll
        outputRoll[outputRoll.length] = "The " + this.enemy.name + " attacks!!!";

        // if the player is parrying
        if(this.playerParryFlag)
        {
            // cut down on the damage dealt
            enemyAttackDamage = Math.Floor(enemyAttackDamage / 2);
        }

        // add the damage dealt text to the outputRoll
        outputRoll[outputRoll.length] = "You are hit for " + enemyAttackDamage + " damage.";
        // deal the damage to the player
        this.player.hit(enemyAttackDamage);
        // check if the player is alive
        if(!this.player.isAlive)
        {
            // if the player has died, add the dead player text to the outputRoll
            outputRoll[outputRoll.length] = "You have been slain. Your bones will serve as a warning to future travellers in this dungeon...";
        }

        // create a new ScrollTextState
        let newState = new ScrollTextState(outputRoll);
        // set a reference to the stateStack in the new scrollTextState
        newState.setStateStack(this.stateStack);
        // get a reference to the menuState that is currently ontop of the stack(?)
        // TODO: assuming that the menuState is ontop of the stack... that seems likely to break...
        let menuState = this.stateStack.getCurrentState();
        // pop the menuState off of the stack
        this.stateStack.popState(menuState);
        // push the scrollTextState onto the stack
        this.stateStack.pushState(newState);
        // set the player to blink
        fi.blinkPlayer = true;
    }

    // playerChannel
    // logic to deal with the player choosing the channel action
    playerChannel()
    {
        // calculate how much mana the player is going to recharge
        let manaRecharge = Math.floor(Math.random() * 50);
        // create a new outputRoll
        let outputRoll = [];
        // add the start chanel text to the roll
        outputRoll[outputRoll.length] = this.player.name + " draws in power from the elements...";
        // add the amount of mana gained text to the roll
        outputRoll[outputRoll.length] = "You gain " + manaRecharge + " mana.";
        // add the mana to the player's mp
        this.player.magicPoints += manaRecharge;

        // create a new ScrollTextState
        let newState = new ScrollTextState(outputRoll);
        // set a reference to the stateStack in the new scrollTextState
        newState.setStateStack(this.stateStack);
        // get the menuState that is currently on the stack
        let menuState = this.stateStack.getCurrentState();
        // pop the menuState off the stack
        this.stateStack.popState(menuState);
        // push the scrollTextState onto the stack
        this.stateStack.pushState(newState);
        // TODO: THIS IS VERY FAMILIAR
        // I'm doing this dance in multiple places
        // definetly need to refactor this into it's own method
    }

    // playerRun
    // logic to deal with the player choosing the run action
    playerRun() {
        // calculate if the player is sucessful in their run attempt
        let runSuccess = Math.random() <= 0.7;
        // create a new outputRoll
        let outputRoll = [];
        // add the run attempt text to the outputRoll
        outputRoll[outputRoll.length] = "You try to run away...";
        // if the run is successful
        if(runSuccess)
        {
            // add the successful run text to the outputRoll
            outputRoll[outputRoll.length] = "Success! You run from the " + this.enemy.name;
            // flip the flag that indicates that the player ran away
            this.playerRan = true;
        }
        // if the run attempt is unsuccessful
        else
        {
            // add the unsuccessful run attempt text to the outputRoll
            outputRoll[outputRoll.length] = "... but the " + this.enemy.name + " blocks your path.";
        }

        // create a new scollTextState
        let newState = new ScrollTextState(outputRoll);
        // add a reference to the current state stack
        newState.setStateStack(this.stateStack);
        // get a reference to the current menuState on the stack
        let menuState = this.stateStack.getCurrentState();
        // pop off the menuState
        this.stateStack.popState(menuState);
        // push on the scrollTextState
        this.stateStack.pushState(newState);
    }

    // calculateInit
    // used to calculate if the player or enemy acts first
    calculateInit() {
        // calculate the percentage oddds of the player going first
        let initPercentage = this.player.initiative / (this.player.initiative + this.enemy.initiative);
        // randomly calculate if the number is less than the initPercentage
        if(Math.random() <= initPercentage)
        {
            // if successful return true
            return true;
        }
        else
        {
            // if unsuccessful return false
            return false;
        }
    }

    // nextAction
    // this calculates what to do next
    nextAction() {
        // check to see if the enemy is dead
        if(!this.enemy.isAlive)
        {
            // clean up the fight interface
            fi.CleanUp();
            // push a new fightWinState onto the stack
            this.stateStack.pushState(new FightWinState());
        }
        // check to see if the player is dead
        else if(!this.player.isAlive)
        {
            // clean up the fight interface
            fi.CleanUp();
            // push a new gameOverState onto the stack
            this.stateStack.pushState(new GameOverState());
        }
        // check to see if the player has run
        else if(this.playerRan)
        {
            // clean up the fight interface
            fi.CleanUp();
            // push a new run away state onto the stack
            this.stateStack.pushState(new RunAwayState());
        }
        // check to see if the player and enemy has not acted
        else if(!this.enemyActed && !this.playerActed)
        {
            // calculate init to see who moves first
            if(this.calculateInit())
            {
                // if the player wins the calculate init, get the player input
                dm.getPlayerInput();
            }
            else
            {
                // otherwise get the enemy's input
                dm.getEnemyInput();
            }
        }
        // if the enemy has acted
        else if(!this.enemyActed)
        {
            // get the enemy input
            dm.getEnemyInput();
        }
        // if the player has acted
        else if(!this.playerActed)
        {
            // get the player input
            dm.getPlayerInput();
        }
        // if the player has acted and the enemy has acted
        else if(this.enemyActed && this.playerActed)
        {
            // set the enemyActed and playerActed to false
            this.enemyActed = false;
            this.playerActed = false;
            // call this function again
            dm.nextAction();
        }
    }
}