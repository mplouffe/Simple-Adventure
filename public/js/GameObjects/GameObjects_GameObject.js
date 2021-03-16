

class GameObject
{
    constructor()
    {
        this.id = UUID();
        this.type = GameObjectComponentType.gameObject;
        this.components = new Map();
    }

    addComponent(component)
    {
        if (this.components.has(component.type))
        {
            console.log("Error: tried to add already existing component type to game object.");
            return;
        }

        this.components.set(component.type, component.id);
    }

    getComponentByType(componentType)
    {
        if (!this.components.has(componentType))
        {
            return null;
        }
        else
        {
            return GameEngine.getGameObject(componentType);
        }
    }
}