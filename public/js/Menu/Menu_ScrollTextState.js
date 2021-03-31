/* Text Boxes State*/

class ScrollTextState
{
    constructor(textBoxArray) {
        this.stateName = "scrolltextstate";				// state name
        this.menuDelay = 0;								// the delay after user inputs comman to prevent to fast choice selection
        this.textBoxArray = textBoxArray;				// the array of text boxes to be displayed in the text window
        this.textPrinted = false;						// boolean to check if the text is still printing out
        this.checkTextRoll();							// ???
    }

    // setStateStack
    // sets a reference to the stateStack this scrollTextState exists in to the stateStack passed in
    setStateStack(stateStack) {
        this.stateStack = stateStack;
    }

    // checkTextRoll
    // checks textBoxArray to see if there is still text that needs to be output to screen
    checkTextRoll() {
        // set the blinkFlag to false
        fi.blinkFlag = false;
        // if there is still textBoxes in the array to be printed out
        if(this.textBoxArray.length > 0){
            // get the text to print out and pull it from the front of the array
            let currentText = this.textBoxArray.shift();
            // pass the text to be printed to the fi
            // also passes a reference to itself? can't remember why I neeeded to do that...
            fi.OutputTextToWindow(currentText, this);
        }
        // if there isn't any more text to output
        else
        {
            // pop this state off of the stack
            this.stateStack.popState(this);
            // updating the fight window UI
            // TODO: THIS TOTALLY SHOULDN'T BE IN HERE
            fi.fightWindowUIP.innerHTML = 'Health: ' + player.playerBattler.hitPoints + ' Mana: ' + player.playerBattler.magicPoints + ' Score: ' + player.score;
            // send control back to the dm for the next action
            dm.nextAction();
        }
    }

    update() {
        // if the text is finished printing out to the screen
        if(this.textPrinted)
        {
            // increment the menuDelay variable
            this.menuDelay++;
            // for each key in the keysDown array
            for(let key in keysDown)
            {
                // get the numeric value of the key
                let value = Number(key);
                // if the key is the space key and the menuDelay has passed 10
                if(value == 32 && this.menuDelay > 10)
                {
                    // reset menuDelay
                    this.menuDelay = 0;
                    // reset textPrinted
                    this.textPrinted = false;
                    // check to see if there is more text needed to print to the screen
                    this.checkTextRoll();
                }
            }
        }
    }

    render() {
        //
    }

    // readyFoNextBox
    // called to set the textPrinted variable to true when the fightInterfae has finished printing out the text
    readyForNextBox() {
        this.textPrinted = true;
    }

    removeState() {

    }

    coverState() {

    }
}