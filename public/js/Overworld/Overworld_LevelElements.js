/* Simple Adventure Level Elements
 * Classes for various level element items.
 * Version: 0.1
 * Date Created: 06.30.2016
 * Last Update: 07.09.2020
 * Author: Matheu Plouffe
 * 
 * History
 * 0.1 - Original prototype objects from XML system
 * 0.2 - Transitioned over to classes with grid system basis
 */


/* WALL OBJECTS
 */
class Wall{
    constructor(x, y, height, width, color){	
        this.Object = new Object(x, y, height, width, color);
        this.tag = "solid";
    }

    /* Wall Renderer
    * uses the wall object's render function
    */
    render(){
        this.Object.render();
    }
}

/* DOOR
 * Creates a door object
 * uses the direction input to calculate it's X and Y values
 * handles it's own locked nature and holds the value of the key that will unlock it if needed
 */
class Door {
    constructor(origin, width, height, doorNumber, locked, key, color, exitTo){
        this.Object = new Object(calculateDoorX(direction), calculateDoorY(direction), calculateDoorWidth(direction), calculateDoorHeight(direction), color);
        this.doorNumber = doorNumber;
        this.locked = locked;
        this.key = key;
        this.exitTo = exitTo;
        this.tag = "door";
    }

    /* Door Renderer
    * simply creates a square for a door if the door is locked
    */
    render(){
        if(this.locked){
            this.Object.render();
        }
    }

    /* Door Collision
    * when the player collides with a door
    * handles repulsing the player if the door is locked
    * loads the value of the next level to load into the game engine
    */
    checkLock(){     
        if(this.locked)
        {
            return true;
        } else if(!this.locked)
        {
            nextLevel = this.exitTo;
            return false;
        }
    }
}

/* ITEM OBJECTS
 * Creates an Item object.
 *
 */
class Item {
    constructor(x, y, itemType, itemName, itemID)
    {
        let itemColor = "#F0F0F0";

        // set the color of the item based on the itemType
        switch(itemType)
        {
            case 'key':
                itemColor = '#FF80FF';
                break;
        }

        this.Object = new Object(x, y, 20, 20, itemColor);
        this.itemType = itemType;
        this.itemName = itemName;
        this.itemID = itemID;
        this.tag = 'item';
    }

    /* getItem
    * the point of this is to pick up the item from the ground, remove it from the XML
    * so it will no longer be redndered when the room is re-entered
    * and add the item to the player's inventory
    */
    getItem(player)
    {
        if(player.tag == 'player')
        {
            if(this.itemType == 'key')
            {
                // add the item to the inventory by calling the player's
                // appropriate add item call depending on item type
                player.addKeyToInventory(this);
            }

            // remove the item from both the player colliders and the current level items
            var indexInLevelItems = currentLevelItems.indexOf(this);
            var indexInPlayerColliders = playerColliders.indexOf(this);
            
            if(indexInLevelItems > -1 && indexInPlayerColliders > -1)
            {
                // remove from the arrays
                currentLevelItems.splice(indexInLevelItems, 1);
                playerColliders.splice(indexInPlayerColliders, 1);

                // remove it from the xml
                var itemToRemove = levels[currentLevel].getElementsByTagName('item')[indexInLevelItems];
                itemToRemove.parentNode.removeChild(itemToRemove);
                return true;
            }
        }
        else
        {
            return false;
        }
    }


    /* Item Renderer
    * Uses the object render function
    */
    render()
    {
        this.Object.render();
    }
}
