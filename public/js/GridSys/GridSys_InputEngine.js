
class InputEngine 
{
    constructor()
    {
        this.keysDown = {};
    }

    onKeyDownEvent(event)
    {
        this.keysDown[event.keyCode] = true;
    }

    onKeyUpEvent(event)
    {
        delete this.keysDown[event.keyCode];
    }
}