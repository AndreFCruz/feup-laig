class ObjectPool {
    constructor(constructorFunction, numElements) {
        this._elements = new Array(numElements);

        for (let i = 0; i < numElements; ++i) {
            this._elements[i] = constructorFunction();
        }
    }

    get elements() {
        return this._elements;
    }

    acquire() {
        return this._elements.pop();
    }

    release(object) {
        this._elements.push(object);
    }
}