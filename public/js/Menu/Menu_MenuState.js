

class MenuState
{
    constructor(gfxEngine, inputEngine, menuContent)
    {
        this.gfxRef = gfxEngine;
        this.menuContent = menuContent;
        this.inputEngine = inputEngine;
        this.gfxRef.canvas.width = 820;
        this.gfxRef.canvas.height = 600;
        this.gfxRef.ui.setAttribute('class', 'textAdventureMenu');
        this.gfxRef.ui.setAttribute('id', 'menuUI');
        this.gfxRef.ui.innerHTML = this.menuContent.textContent;
    }

    update()
    {
        if (this.menuContent.seekInput)
        { 
            let updateResult = false;
            for(let key in this.inputEngine.keysDown){
                let value = Number(key);
                switch (value)
                {
                    case 32:
                        updateResult = true;
                        break;
                }
            }
            return updateResult;
        }
        else
        {
            return true;
        }
    }

    render()
    {
        //
    }

    removeState()
    {

    }

    coverState()
    {

    }

    getStateResult()
    {
        return StateResult.remove;
    }

    refresh()
    {
        this.gfxRef.ui.setAttribute('class', 'textAdventureMenu');
        this.gfxRef.ui.setAttribute('id', 'menuUI');
        this.gfxRef.ui.innerHTML = this.menuContent.textContent;
    }
}