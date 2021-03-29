

class MenuStateFactory
{
    constructor(gfxEngine, inputEngine)
    {
        this.gfxRef = gfxEngine;
        this.inputEngine = inputEngine;
    }

    getStartMenuState()
    {
        return new MenuState(this.gfxRef, this.inputEngine, "<p>Simple Adventure</p><p>Press Space Bar to Start</p>");
    }

    getEndMenuState()
    {
        return new MenuState(this.gfxRef, this.inputEngine, "<p>You Win</p><p>Game Over</p>");
    }
}