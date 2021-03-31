
/* BUILDING INTERFACES
 * Right now all my building interface is in this method.
 * when the fight is called, this just builds everything in one go.
 * elements are or aren't rendered depending on boolean conditions
 * 
 * THIS NEEDS TO BE BROKEN UP
 * Need to be able to rewrite the contents of the two input windows dynamically
 * Spells and Items will share menu on right side of screen
 * Need to figure out how to scroll between contents
 * Need to figure out how to store and retrieve the window contents.
 */


class FightInterface
{
    constructor(gfxRef){

        // set a reference to the section passed in
        this.fightSection = gfxRef;
        // set the class to 'fightSection'
        this.fightSection.setAttribute('class', 'fightSection');
        
        // set a reference to the canvas passed in
        this.enemyWindow = gfxRef.canvas;
        // set the class to 'enemyWindow'
        this.enemyWindow.setAttribute('class', 'enemyWindow');
        
        // build the leftInputDiv
        this.buildLeftInputDiv();
        // build the RightInputDiv
        this.buildRightInputDiv();
        // build the outputWindow
        this.buildOutputWindow();
        // build the UI
        this.buildUI();
        
        // declare a couple of variables that are the dimensions of the enemy window
        let ewWidth = 400;
        let ewHeight = 300;
        // set the enemy window's width and height to the width and height of the window
        this.enemyWindow.width = ewWidth;
        this.enemyWindow.height = ewHeight;
        // get a reference to the context of the canvas
        this.enemyWindowContext = this.enemyWindow.getContext('2d');

        // set the blinkFlag to false
        this.blinkFlag = false;
        // set the blinkEnemy to false
        this.blinkEnemy = false;
        // set the blinkPlayer to false
        this.blinkPlayer = false;
    }

    cleanUp()
    {
        // get an array of inputMenus
        let inputMenus = document.getElementsByTagName('section')[0].getElementsByTagName('div');
        // for each of the inputMenus in the array
        for(let i = inputMenus.length - 1; i > 0; i--)
        {
            // get the parent of the inputMenu
            let parent = inputMenus[i].parentElement;
            // use the parent reference to remove the inputMenuElement
            parent.removeChild(inputMenus[i]);
        }
    }

    buildLeftInputDiv()
    {
        // create the div element
        this.leftInputDiv = document.createElement('div');
        // set the class to 'leftInputWindow'
        this.leftInputDiv.setAttribute('class', 'leftInputWindow');
        
        // create a p element
        this.leftInputP = document.createElement('p');
        // set the class of the leftInputP to 'inputMenu'
        this.leftInputP.setAttribute('class', 'inputMenu');
        
        // create a leftInputIcon element
        this.leftInputIcon = document.createElement('i');
        // set the innerHTML to the icon (THIS IS CURRENTLY KINDA BROKEN)
        this.leftInputIcon.innerHTML = "&#xE154;";
        // set the class to 'material-icons'
        this.leftInputIcon.setAttribute('class', 'material-icons');
        // set the left position to 10px
        this.leftInputIcon.style.left = '10px';
        // set the top position to 4px
        this.leftInputIcon.style.top = '4px';
        
        // build the menu
        // append the inputP to the inputDiv
        this.leftInputDiv.appendChild(this.leftInputP);
        // append the inputIcon to the inputDiv
        this.leftInputDiv.appendChild(this.leftInputIcon);
        // set the leftInputDiv style to 'none'
        this.leftInputDiv.style.display = "none";
        // append the leftInputDiv to the fightSection of the fight interface
        this.fightSection.appendChild(this.leftInputDiv);
    }

    buildUI()
    {
        // create a new div element
        this.fightWindowUIDiv = document.createElement('div');
        // set the class to 'fightWindowUIDiv'
        this.fightWindowUIDiv.setAttribute('class', 'fightWindowUIDiv');

        // create a new p element
        this.fightWindowUIP = document.createElement('p');
        // set the class of the p element to 'fightWindowUIP'
        this.fightWindowUIP.setAttribute('class', 'fightWindowUIP');
        // set the innerHTML of the fightWindowUIP to the score and mana
        this.fightWindowUIP.innerHTML = 'Health: ' + player.playerBattler.hitPoints + ' Mana: ' + player.playerBattler.magicPoints + ' Score: ' + player.score;
        // append the fightWindowUIP to the fightWindowUIDiv
        this.fightWindowUIDiv.appendChild(this.fightWindowUIP);
        // append the UIDiv to the fightSection
        this.fightSection.appendChild(this.fightWindowUIDiv);
    }

    // buildRightInputDiv
    // puts together and builds the rightInputDiv
    // TODO: this seems to be identical to the buildLeftInputDiv except for the class name so I should combine the two
    // into a single function that takes the class name as a parameter
    buildRightInputDiv()
    {
        // create a div element
        this.rightInputDiv = document.createElement('div');
        // set the class to 'rightInputWindow'
        this.rightInputDiv.setAttribute('class', 'rightInputWindow');

        // create a p element
        this.rightInputP = document.createElement('p');
        // set the class to 'inputMenu'
        this.rightInputP.setAttribute('class', 'inputMenu');

        // create an i element
        this.rightInputIcon = document.createElement('i');
        // set the innerHTML of the i element  to the icon
        this.rightInputIcon.innerHTML = "&#xE154;";
        // set the attribupt of the inputIcon to the material-icons
        this.rightInputIcon.setAttribute('class', 'material-icons');
        // set the left to 10px
        this.rightInputIcon.style.left = '10px';
        // set the top to 4px
        this.rightInputIcon.style.top = '4px';

        // append the p element to the rightInputDiv
        this.rightInputDiv.appendChild(this.rightInputP);
        // append the icon to the rightInputDiv
        this.rightInputDiv.appendChild(this.rightInputIcon);
        // set the display to none
        this.rightInputDiv.style.display = "none";

        // append the rightInputDiv to the fightSection
        this.fightSection.appendChild(this.rightInputDiv);
    }

    // buildOutputWindow
    // puts together and builds the outputWindow
    buildOutputWindow()
    {
        // create a div element
        this.outputWindow = document.createElement('div');
        // set the class attribute to outputWindow
        this.outputWindow.setAttribute('class', 'outputWindow');

        // create a p element
        this.outputWindowText = document.createElement('p');
        // set the class of the p element to outputWindowText
        this.outputWindowText.setAttribute('class', 'outputWindowText');

        // create an i element
        this.outputWindowNextIcon = document.createElement('i');
        // set the innerHTML to the icon
        this.outputWindowNextIcon.innerHTML = "&#xE154;";
        // set the class to material-icons
        this.outputWindowNextIcon.setAttribute('class', 'material-icons');
        // set the bottom to 10px
        this.outputWindowNextIcon.style.bottom = "10px";
        // set the right to 10px
        this.outputWindowNextIcon.style.right = "10px";
        // set the display to none
        this.outputWindowNextIcon.style.display = 'none';
        
        // append the outputWindowText to the outputWindow
        this.outputWindow.appendChild(this.outputWindowText);
        // append the nextIcon to the outputWindow
        this.outputWindow.appendChild(this.outputWindowNextIcon);
        // append the outputWindow to the fightSection
        this.fightSection.appendChild(this.outputWindow);
    }

    // setLeftInputMenu
    // sets the leftInputMenu
    // turns on the display and I'm not sure what's going on with the currentIconPosition
    // not sure what's going on with the value passed in...
    setLeftInputMenu()
    {
        this.currentIconPosition = 4;
        this.leftInputDiv.style.display = "block";
    }

    // setRightInputMenu
    // sets the rightInputMenu
    // same as the setRightInputMenu, turns the display on, but not sure what's going on with the value passed in
    // or with the top being set to 4px
    setRightInputMenu()
    {
        this.rightInputIcon.style.top = "4px";
        this.rightInputDiv.style.display = "block";
    }

    // outputTextToWindow
    // this is used to output a scroll text to the window
    outputTextToWindow(stringToOutput, scrollTextState)
    {
        let start = 0;			// holds for the start substring
        let end = 0;			// holds for the end of the substring
        let interval = 40;		// the interval between letters being output
        let thefi = this;		// a reference to the fight interface that gets passed to the blinkElement
    
        // the interval method that types out the text
        let clear = setInterval(function(){
            // get a section of the stringToOutput to output
            let newText = stringToOutput.substr(start, end);
            // set the innerHTML to the newText
            thefi.outputWindowText.innerHTML = newText;
            // increase the end counter
            end += 1;
            // if the textBeing output matches the stringToOutput
            if(newText == stringToOutput){
                // clear the interval function
                clearInterval(clear);
                // set the blink flag to true
                thefi.blinkFlag = true;
                // start blinking the next icon
                thefi.blinkElement(thefi.outputWindowNextIcon, 300, thefi);
                // call ready for nextBox on the scrollTextState
                scrollTextState.readyForNextBox();
            }
        }, interval);
    }

    // setBlinkDuration
    // used to blinkElements I guess?
    // not sure where I'm using this... cause I'm usign the BlinkElement function below to actually blink the element
    setBlinkDuration(blinkDuration)
    {
        // set blinking to true
        let blinking = true;
        // the interval to used to blink elements
        // turns blinking on on off depending on if it is already blinking
        let blinkingFor = setInterval(function(){
            if(blinking){
                blinking = false;
            }else{
                fi.blinkFlag = false;
            }
        }, blinkDuration);
    }

    // BlinkElement
    // used to blink elements
    blinkElement(elementToBlink, blinkInterval, thefi)
    {
        // the blink on interval
        let blinkOn = true;
        // the interval used to blink and element
        let blink = setInterval(function(){
            // if blinkOn
            if(blinkOn){
                // set blinkOn to false
                blinkOn = false;
                // turn the display on
                elementToBlink.style.display = 'block';
            }
            // otherwise
            else{
                // set the blinkOn to true
                blinkOn = true;
                // turn the display to none
                elementToBlink.style.display = 'none';
            }
            // if hte blinkFlag has been set to false
            if(thefi.blinkFlag == false)
            {
                // clear the interval
                clearInterval(blink);
                // turn off the element that was being blinked
                elementToBlink.style.display = 'none';
            }
        }, blinkInterval);
    }

    // turnOffInputMenus
    // simply turns off the two input menus
    turnOffInputMenus()
    {
        this.rightInputDiv.style.display = "none";
        this.leftInputDiv.style.display = "none";
    }
}