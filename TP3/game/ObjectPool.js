/**
 * Generic class that creates a pool of objects
 */
class ObjectPool {

    /**
     * ObjectPool constructor
     * 
     * @param {String} constructorFunction - Function used to construvt the pool's objects
     * @param {Number} numElements - Number of elements of the pool
     */
    constructor(constructorFunction, numElements) {
        this._elements = new Array(numElements);

        for (let i = 0; i < numElements; ++i) {
            this._elements[i] = constructorFunction();
        }
    }

    /**
     * Return all the array of elements that make the pool
     * 
     * @return {Array}
     */
    get elements() {
        return this._elements;
    }

    /**
     * Gets the last added element out of the pool of objects, returning it
     * 
     * @return {Object}
     */
    acquire() {
        return this._elements.pop();
    }

    /**
     * Adds an element into the pool of objects
     * 
     * @param {Object} object - The object to be added to the pool of objects 
     * @return {null}
     */
    release(object) {
        this._elements.push(object);
    }
}