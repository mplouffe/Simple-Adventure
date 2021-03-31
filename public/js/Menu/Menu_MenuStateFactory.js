

class MenuStateFactory
{
    constructor(gfxEngine, inputEngine)
    {
        this.gfxRef = gfxEngine;
        this.inputEngine = inputEngine;
    }

    getStartMenuState()
    {
        let menuContent = 
        {
            textContent: "<p>Simple Adventure</p><p>Press Space Bar to Start</p>",
            seekInput: true
        };
        return new MenuState(this.gfxRef, this.inputEngine, menuContent);
    }

    getEndMenuState()
    {
        let menuContent = 
        {
            textContent: "<p>You Win</p><p>Game Over</p>",
            seekInput: false
        };
        return new MenuState(this.gfxRef, this.inputEngine, menuContent);
    }
}