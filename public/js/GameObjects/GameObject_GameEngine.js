

class GOGameEngine
{
    static gameObjectDirectory = new GameObjectDirectory();

    constructor() {
        this.gfxEngine = new GGfxEngine();
        this.inputEngine = new InputEngine();

        this.dynamicObjects = [];
        this.staticObjects = [];
        this.player = new Player(0, 10, 20, "Dude!!!", this.inputEngine);
        this.stateMachine = new StateStack(new OverWorldState(this.gfxEngine, this.player));
        this.stopAnimating = false;
        this.start = Date.now();
        this.lastTick = this.start;
    }

    step() {
        if(!this.stopAnimating) {
            this.stateMachine.update();
            this.stateMachine.render();
            let currentTick = Date.now();
            deltaTime = currentTick - this.lastTick;
            this.lastTick = currentTick;
        }
    }

    static getGameObject(gameObjectId)
    {
        return this.gameObjectDirectory.getGameObject(gameObjectId);
    }

    static instantiateGameObject(gameObject)
    {
        this.gameObjectDirectory.addGameObjectToReferenceMap(gameObject);
    }
}