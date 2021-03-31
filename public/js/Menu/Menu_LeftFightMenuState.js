/* Left Menu State */

class LeftMenuState
{
    constructor() {
        this.stateName = "leftMenuState";		// name of the state
        this.menuDelay = 0;						// used to delay accepting user input after input (to prevent overly quick double choices)
        this.menuOffset = 0;
    }

    // setStateStack
    // used to set a reference to the stateStack that the state lives in
    setStateStack(stateStack) {
        this.stateStack = stateStack;
    }

    // setMenuItemsArray
    // sets the contents of the menuItemsArray into 
    setMenuItemsArray(menuItemArray) {
        fi.leftInputIcon.style.top = "4px";			// can't remember quite what this is for but related to the position of the menu cursor
        this.menuOffset = 0;						// again something to do with the positon of the menu cursor (I think offset) TODO: really need to figure out what this is for
        this.menuItems = menuItemArray;				// sets a reference to the menuItemArray passed in
    }

    // render
    // render method for the inputMenu
    render() {
        // make sure the display is set to block
        fi.leftInputDiv.style.display = "block";
        // clear out the innerHTML
        fi.leftInputP.innerHTML = "";
        // set the max for the amount of menuItems, either 5 or the number of items in the list
        let max = this.menuItems.length < 5 ? this.menuItems.length : 5;
        
        // for all the items in the menuItems list
        for(let i = 0; i < max; i++)
        {
            // write the content of the menuItem out to the inputMenu
            fi.leftInputP.innerHTML += this.menuItems[i + this.menuOffset].textTag;
            // as long as we're under 4
            if(i < 4)
            {
                // add a break to put the next input onto the next line
                fi.leftInputP.innerHTML += "<br>";
            }
        }
    }

    // update
    // update method for the inputMenu
    update() {
        // update the menuDelay value
        this.menuDelay++;
        // check the keys in the keysDown array
            for(let key in keysDown){
                // get the current position of the inputIcon
                let currentIconPosition = parseInt(fi.leftInputIcon.style.top);
            // get the value of the current input key in the keysDown array
            let value = Number(key);
            
            // for moving up and down
            // if the key is the up key and currentIconPosition is greater than 4 and menuDelay is greater than 10
            if(value == 38 && currentIconPosition > 4 && this.menuDelay > 10)
            {
                // if the currentIconPosition is at the top (34) and the menuOffest if greater than 0
                if(currentIconPosition == 34 && this.menuOffset > 0)
                {
                    // reset the delay
                    this.menuDelay = 0;
                    // subtract fromt the menuOffset
                    this.menuOffset--;
                }
                // if the currentIconPosition isn't at the top yet
                else
                {
                    // reset the menu delay
                    this.menuDelay = 0;
                    // move the currentIconPosition up one positon (30)
                    currentIconPosition -= 30;
                    // set the location of the inputIcon to the currentIconPosition
                    fi.leftInputIcon.style.top = currentIconPosition + "px";
                }
            }
            // if the key is the down key and the menuDelay is greater than 10
            else if (value == 40 && this.menuDelay > 10)
            {
                // if the currentIconPositon is at the bottom (94) and the menuOffset is less than the max
                // (not sure how menuItems.length-5 = the max?)	
                if(currentIconPosition == 94 && this.menuOffset < this.menuItems.length - 5)
                {
                    // reset the menuDelay
                    this.menuDelay = 0;
                    // increase the menuOffset
                    this.menuOffset++;
                }
                // if the currentIconPosition isn't at the bottom yet
                else
                {
                    // if the currentIconPosiiton is less than the menuItemsLengh and the currentIconPositon is less than 100
                    if(((currentIconPosition - 4)/30) < this.menuItems.length && currentIconPosition < 100)
                    {
                        // reset the menuDelay
                        this.menuDelay = 0;
                        // increase the currentIconPosition by 30
                        currentIconPosition += 30;
                        // set the location of the inputIcont to the currentIconPosition
                        fi.leftInputIcon.style.top = currentIconPosition + "px";
                    }
                }
            }
            // if space pressed
            else if(value == 32 && this.menuDelay > 10)
            {
                // this is where I turn it off because I've made a choice with it.
                this.menuDelay = 0;
                // the pickedIndex is set to the currentIconPosition plus the menuOffset??
                // not sure why that equation equals the pickedIndex
                let pickedIndex = ((currentIconPosition - 4) / 30) + this.menuOffset;
                // calls picked on the pickedIndex
                this.menuItems[pickedIndex].picked(this);
            }
        }
    }

    // refresh function
    // just calls render
    // used to render the menuState when required
    refresh() {
        this.render();
    }
}