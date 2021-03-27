

class MenuState
{
    constructor(gfxEngine, menuContent)
    {
        this.gfxRef = gfxEngine;
        this.menuContent = menuContent;

        this.gfxRef.ui.setAttribute('class', 'textAdventureMenu');
        this.gfxRef.ui.setAttribute('id', 'menuUI');
        this.gfxRef.ui.innerHTML = this.menuContent;
    }

    update()
    {
        return false;
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

    }

    refresh()
    {
        this.gfxRef.ui.setAttribute('class', 'textAdventureMenu');
        this.gfxRef.ui.setAttribute('id', 'menuUI');
        this.gfxRef.ui.innerHTML = this.menuContent;
    }
}