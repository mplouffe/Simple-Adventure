
function InputEngine()
{
    this.keysDown = [];
    window.addEventListener("keydown", function(event){
        this.keysDown[event.keyCode] = true;
    });
    
    window.addEventListener("keyup", function(event){
        delete this.keysDown[event.keyCode];
    });
}