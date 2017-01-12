import initialState from './mainIntialState';
import {deepClone} from '../../../utills/services';

const mainReducer = (state = initialState, action) => {

    const newState = deepClone(state); 

    switch (action.type) {

        case 'SET_ENTITY_TYPES':
        {
            newState.entityTypes = action.data;
            return newState;
        }
        case 'SET_ADDABLE_ENTITY_TYPES_INFO':
        {
            newState.addableEntityTypesInfo = action.data;
            return newState;
        }
        case 'DELETE_ENTITY':
        {
            const unReached = -1;
            const entityIdx = getEntityById(action.data, state.entityTypes);

            if(entityIdx != unReached) {
                newState.entityTypes.splice(entityIdx, 1);
            }
            
            return newState;
        }
        case 'ADD_ENTITY':
        {
            const unReached = -1,
                whereToAdd = getEntityTypeIdx(newState.entityTypes, action.data.entityTypeName);

            if(whereToAdd !== unReached) {
                newState.entityTypes[whereToAdd].push(action.data.entityToAdd);
            }
  
            return newState;
        }
        case 'SET_ENTITY_POSITION':
        {
            const unReached = -1;
            const entityIdx = getEntityById(action.data.entityIdUpdate, state.entityTypes);

            if(entityIdx != unReached) {
                newState.entityTypes[entityIdx].position = action.data.entityPosition;
            }

            return newState;
        }
        
        default:
            return state;
    }
};

export default mainReducer;

// -------------------------------------------- helper functions -------------------

/**
 * get entity index in the container array by his id
 * @param {String} entityId
 * @param {Array} entityContianer
 * @returns {Number} the entity index if found, otherwise -1
 */
export function getEntityById(entityId, entityContianer) {
    let entityIdx = -1;

    for(let i = 0 ; i < entityContianer. length; i++) {
        const currentEntity = entityContianer[i];

        if (currentEntity.id === entityId) {
            entityIdx = i;
            break;
        }
    }

    return entityIdx;
}

/**
 * get entity type index by name
 * @param {Array} entityTypeArr
 * @param {String} entityTypeName
 * @returns {Number} -1 if not found
 */
export function getEntityTypeIdx(entityTypeArr, entityTypeName) {
    let idxToReturn = -1;

    for(let i = 0 ; i < entityTypeArr.length; i++) {
        if(entityTypeArr[i].name === entityTypeName) {
            idxToReturn = i;
            break;
        }
    }

    return idxToReturn;
}