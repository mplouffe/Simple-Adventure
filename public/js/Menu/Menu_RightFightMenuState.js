/* Right Menu State */
/* Check the Left Menu State for details on each method */
/* TODO: Consider combining the two menuStates into a more generic menu state that can be used for both */

class RightMenuState
{
    constructor() {
        this.stateName = "rightmenustate";
        this.menuDelay = 0;
        this.menuOffset = 0;
    }

    setStateStack(stateStack) {
        this.stateStack = stateStack;
        fi.rightInputIcon.style.top = "4px";
        this.menuOffset = 0;
    }

    setMenuItemsArray(menuItemArray) {
        this.menuItems = menuItemArray;
        console.log("Menu Items Set: " + this.menuItems);
    }

    update() {
        this.menuDelay++;
        for(let key in keysDown){
            let currentIconPosition = parseInt(fi.rightInputIcon.style.top);
           let value = Number(key);
           // for moving up and down
           if(value == 38 && currentIconPosition > 4 && this.menuDelay > 10)
           {
               if(currentIconPosition == 34 && this.menuOffset > 0)
               {
                   this.menuDelay = 0;
                   this.menuOffset--;
               }
               else
               {
                   this.menuDelay = 0;
                   currentIconPosition -= 30;
                   fi.rightInputIcon.style.top = currentIconPosition + "px";
               }
           }
           else if (value == 40 && this.menuDelay > 10){
               
               if(currentIconPosition == 94 && this.menuOffset < this.menuItems.length - 5)
               {
                   this.menuDelay = 0;
                   this.menuOffset++;
               }
               else
               {
                   if(((currentIconPosition - 4)/30) < this.menuItems.length - 1 && currentIconPosition < 100)
                   {
                       this.menuDelay = 0;
                       currentIconPosition += 30;
                       fi.rightInputIcon.style.top = currentIconPosition + "px";
                   }
               }
           }
           // if space pressed
           else if(value == 32 && this.menuDelay > 10)
           {
               console.log("picked");
               // this is where I turn it off because I've made a choice with it.
               this.menuDelay = 0;
               let pickedIndex = ((currentIconPosition - 4) / 30) + this.menuOffset;
               this.menuItems[pickedIndex].picked(this);
           }
   
           else if(value == 37 && this.menuDelay > 10)
           {
               fi.rightInputDiv.style.display = "none";
               this.stateStack.popState(this);
           }
       }
    }

    render() {
        fi.rightInputDiv.style.display = "block";
        fi.rightInputP.innerHTML = "";
        let max = this.menuItems.length < 5 ? this.menuItems.length : 5;
    
        for(let i = 0; i < max; i++)
        {
            fi.rightInputP.innerHTML += this.menuItems[i + this.menuOffset].textTag;
    
            if(i < 4)
            {
                fi.rightInputP.innerHTML += "<br>";
            }
        }
    }

    refresh() {
        this.render();
    }
}