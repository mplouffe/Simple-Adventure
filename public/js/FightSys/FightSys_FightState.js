/* Simple Adventure Fight Engine
 * A simple rpg turn based fighting engine patterned after Dragon Warrior
 * Version: 0.3
 * Date Created: 07.01.2016
 * Last Updated: 30.03.2020
 * Author: Matheu Plouffe
 *
 * History
 * 0.1 - Initial Build
 * 0.2 - Added comments so I could remember what the hell was going on
 * 0.3 - Changed to class
 */

/* USED BY ENGINE */

/* FIGHT STATE */
class FightState
{
    constructor(gfxRef, player, enemy) {
        // setting up variables
        this.stateName = "fight";				// name of the current state (used for logic in update method)
        this.waitingForPlayerInput = true;
        this.dialogPause;
        this.currentIconPosition = 4;
        this.playerInput;
        this.waitingForPlayerReading;
        this.blinkWait;
        this.readDelay = 0;
        this.numberOfBlinks = 0;
        this.blinkCounter = 0;
        
        // creating the fight interface
        this.fi = new FightInterface(gfxRef);
        // getting the playerBattler from the global player object
        let playerBattler = player.playerBattler;
        // setting the local enemyBattler reference from the enemy object passed in
        let enemyBattler = enemy;
        
        // setting up the spell array
        // TODO: right now it is just hard coded in, this needs to come from the player object
        let spellArray = [new Spell("HURT", "damage", 10, 2), new Spell("HEAL", "heal", 10, 2)];
        // add the newly created spell array to the player battler object
        playerBattler.addSpells(spellArray);
        // TODO: this all seems weird. Can't the spells just be an array object already associated with the player global object?

        // set up the start of the fight dialog
        let fightStartText = ["A " + enemyBattler.name + " approaches!!!"];
        // create the start state passing in the start of fight dialog
        let startState = new ScrollTextState(fightStartText);
        // create the new fight state machine
        this.fightStateMachine = new StateStack(startState);
        // why does the state need a reference to it's own state machine? That seems broken
        // TODO: reconsider this
        // RECONSIDERED: I have the states manipulate the logic of the state machine
        // without the state doing the maniplation, the state machine would have to know way to much about the states
        startState.setStateStack(this.fightStateMachine);

        // create the new DM object passing in the playerBattler, enemyBattler, and fight state machine
        dm = new DungeonMaster(playerBattler, enemyBattler, this.fightStateMachine);
    }

    // Update
    update() {
        // get the current state of the fightStateMachine
        let currentState = this.fightStateMachine.getCurrentState();
        // if the current state isn't null
        if(currentState != null)
        {
            // if the current state is 'fightwin' or 'runaway'
            if(currentState.stateName == "fightwin" || currentState.stateName == "runaway")
            {
                // pop this state off the stack
                stateMachine.popState(this);
            }
            // if the state is game over
            else if(currentState.stateName == "gameover")
            {
                // not sure if this state is currently reachable, definitely has not been tested
                stateMachine.popState(this);
                // not sure why I'm doing two pop states
                // seems a better idea would be to pop itself, then pass a message of game over up the stack to the 
                // next state to deal with it however it wants to
                let currentState = stateMachine.getCurrentState();
                if(currentState != null)
                {
                    stateMachine.popState(currentState);
                }
            }
            // otherwise
            else
            {
                // update the fightStateMachine's current state
                this.fightStateMachine.currentState.update();
            }
        }
    }

    render() {
        // clear up the enemyWindowContext in the fightInterface
        fi.enemyWindowContext.clearRect(0, 0, canvas.width, canvas.height);

        // used for when the background is blinking due to the player being hit
        // blinkCounter counts the frames that the background should be on or off for
        if(fi.blinkPlayer){
            // if less than 8, just increase the blinkCounter (empty background)
            if(this.blinkCounter < 8)
            {
                this.blinkCounter++;
            }
            // if the blinkCounter is between 8 and 16 background is on and blinkCounter increases
            else if(this.blinkCounter < 16)
            {
                this.blinkCounter++;
                // consider refactoring this into it's own method cause I use it in three seperate places
                let enemyWindowBG = new Image();
                enemyWindowBG.src = 'imgs/fightWindowBackground.png';
                // I'm drawing the background and the enemy at some point so maybe combine all the draws into a single method or area?
                fi.enemyWindowContext.drawImage(enemyWindowBG, 0, 0);
            }
            // if the blinkCounter is over 16 check the number of times the blink has happened,
            // if it's less than 4, add to the numberOfBlinks and reset the blinkCounter
            else if(this.numberOfBlinks < 4)
            {
                this.blinkCounter = 0;
                this.numberOfBlinks++;
            }
            // if the background has already blinked four times:
            // turn off the blink player
            // turn on the background
            // reset the numberOfBlinks
            // reset the blinkCounter
            else
            {
                /* DRAWING BACKGROUND */
                let enemyWindowBG = new Image();
                enemyWindowBG.src = 'imgs/fightWindowBackground.png';
                fi.enemyWindowContext.drawImage(enemyWindowBG, 0, 0);
                /**********************/
                fi.blinkPlayer = false;
                this.blinkCounter = 0;
                this.numberOfBlinks = 0;
            }
        }
        // if the background is not blinking
        else
        {
            /* DRAWING BACKGROUND */
            let enemyWindowBG = new Image();
            enemyWindowBG.src = 'imgs/fightWindowBackground.png';
            fi.enemyWindowContext.drawImage(enemyWindowBG, 0, 0);
            /**********************/
        }
        // if the enemy is alive and and blinking (or blinking? why the or???)
        if(dm.enemy.isAlive || fi.blinkEnemy)
        {
            // if the enemy is blinking
            if(fi.blinkEnemy){
                // if the blinkCounter is at less than 8
                if(this.blinkCounter < 8)
                {
                    // increase the blinkCounter (no enemy)
                    this.blinkCounter++;
                }
                // if the blinkCounter is between 8 and 16 turn on the enemy and increase the blinkCounter
                else if(this.blinkCounter < 16)
                {
                    this.blinkCounter++;
                    /* Drawing the Enemy */
                    let enemy = new Image();
                    enemy.src = 'imgs/greenSlime.png';
                    fi.enemyWindowContext.drawImage(enemy, 0, 0);
                    /*********************/
                }
                // if the blinkCounter is over 16 check the number of blinks,
                // if it's less than 4, increase the number of blinks and reset the blinkCounter
                else if(this.numberOfBlinks < 4)
                {
                    this.blinkCounter = 0;
                    this.numberOfBlinks++;
                }
                // if the numberOfBlinks is over 4:
                // turn off the blinkEnemy
                // turn on the enemyImage
                // reset he blinkCounter
                // reset the numberOfBlinks
                else
                {
                    /* Drawing the Enemy */
                    let enemy = new Image();
                    enemy.src = 'imgs/greenSlime.png';
                    fi.enemyWindowContext.drawImage(enemy, 0, 0);
                    /*********************/
                    fi.blinkEnemy = false;
                    this.blinkCounter = 0;
                    this.numberOfBlinks = 0;
                }
            }
            // otherwise if the enemy isn't blinking
            else
            {
                /* Drawing the Enemy */
                let enemy = new Image();
                enemy.src = 'imgs/greenSlime.png';
                fi.enemyWindowContext.drawImage(enemy, 0, 0);
                /*********************/
            }
        }

        // check to make sure the fightStateMachine's currentState isn't null
        if(this.fightStateMachine.currentState != null)
        {
            // render the current fightStateMachine state
            this.fightStateMachine.currentState.render();
        }
    }

    removeState() {
        //
    }

    coverState() {
        //
    }
}

/* Fight Win State */
// only has the name of the state
// the logic is implemented by the update of the fight state
class FightWinState
{
    constructor() {
        this.stateName = "fightwin";
    }

    render() {

    }

    removeState() {

    }

    coverState() {

    }
}

/* Game Over State */
// only has the name of the state
// the logic is implemented by the update of the fight state
class GameOverState
{
    constructor() {
        this.stateName = "gameover";
    }

    render() {

    }

    removeState() {

    }

    coverState() {

    }
}

/* Run Away State */
// only has the name of the state
// the logic is implemented by the update of the fight state
class RunAwayState
{
    constructor() {
        this.stateName = "runaway";
    }

    render() {
        //
    }

    removeState() {
        //
    }

    coverState() {
        //
    }
}