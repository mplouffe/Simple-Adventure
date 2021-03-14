



class GameObjectComponentTypeReference
{
    constructor()
    {
        this.componentTypeReferenceMap = new Map();
        for(let componentType in GameObjectComponentType)
        {
            this.componentTypeReferenceMap.set(componentType, []);
        }
    }  

    addComponentReference(componentType, reference)
    {
        if (!this.componentTypeReferenceMap.has(componentType))
        {
            console.log("Error: Tried to add component type that could not be found to reference map ");
            return;
        }

        let currentReferences = this.componentTypeReferenceMap.get(componentType)
        currentReferences[currentReferences.length] = reference;
    }

    getReferencesByComponentType(componentType)
    {
        if (!this.componentTypeReferenceMap.has(componentType))
        {
            console.log("Error: Tried to get component type that could not be found to reference map ");
            return;
        }

        return this.componentTypeReferenceMap.get(componentType);
    }
}