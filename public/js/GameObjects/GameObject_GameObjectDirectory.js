

class GameObjectDirectory
{
    constructor()
    {
        this.gameObjectComponentTypeReference = new GameObjectComponentTypeReference();
        this.gameObjectMap = new Map();
    }

    addGameObjectToReferenceMap(gameObject)
    {
        this.gameObjectMap.set(gameObject.id, gameObject);
        this.gameObjectComponentTypeReference.addComponentReference(gameObject.type, gameObject.id);
    }

    getGameObject(gameObjectId)
    {
        if (!this.gameObjectMap.has(gameObjectId))
        {
            return null;
        }
        else
        {
            return this.gameObjectMap.get(gameObjectId);
        }
    }
}