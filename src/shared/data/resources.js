//------ ENTITY_TYPE NAMES --------------
const UAV = 'UAV';
const HELICOPTERS = 'Helicopters';
const DMA = 'DynamicMissionArea';
const FLIGHT_CIRCLE = 'FlightCircle';
//--------------------------------- ------- ACTION NAMES ------------
const ADD = 'ADD';
const DELETE = 'DELETE';
const UPDATE_POSITION = 'UPDATE_POSITION';
const MAP_CENTER = 'MAP_CENTER';
const TOGGLE_ENTITY_TYPE = 'TOGGLE_ENTITY_TYPE';
const SET_ENTITY_CESIUM_ID = 'SET_ENTITY_CESIUM_ID';
const TOGGLE_BEST_FIT_DISPLAY = 'TOGGLE_BEST_FIT_DISPLAY';
//--------------------------------- ------ AGENTS ------------------
const USER = 'USER';
const API = 'API';
//--------------------------------

export const resources = {
    FLIGHT_CIRCLE: FLIGHT_CIRCLE,
    DMA: DMA,
    UAV: UAV,
    HELICOPTERS: HELICOPTERS,
    MAP_CENTER: {
        longitude: 34.99249855493725,
        latitude:  32.79628841345832,
        height: 1.0
    },
    IMG: {
        BASE_URL: 'src/shared/images/',
        SCALE: '25%',
        MAX_WIDTH: '65px',
        MAX_HEIGHT: '45px'
    },
    AGENTS: {
        USER: USER,
        API: API
    },
    ENTITY_TYPES: {
        [FLIGHT_CIRCLE]: {
            IMG: 'icon_1.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new flight circle.',
                    IMG: 'icon_11.svg',
                    SCALE: 2
                }
            }
        },
        [DMA]: {
            IMG: 'icon_9.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new destination point',
                    IMG: 'icon_9.svg'
                }
            }
        },
        [UAV]: {
            IMG: 'icon_5.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new UAV',
                    IMG: 'icon_5_black_1.svg'
                }
            }
        },
        [HELICOPTERS]: {
            IMG: 'icon_3.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new helicopter',
                    IMG: 'icon_3_black_1.svg'
                }
            }
        }        
    },
    ACTIONS: {
        ADD: {
            TYPE: ADD,
            DESC: 'Add a new entity',
            ENTITY_TYPES: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ], //ON WHAT ENTITY_TYPES CAN THIS ACTION BE PERFORMED
            AGENTS: [
                USER, API
            ], //WHOS CAN PERFORM ACTION
            IMG: 'entityType'
        },
        DELETE: {
            TYPE: DELETE,
            DESC: 'Delete an entity',
            ENTITY_TYPES: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [
                USER, API
            ],
            IMG: 'icon_7.svg'
        },
        UPDATE_POSITION: {
            TYPE: UPDATE_POSITION,
            DESC: 'Change position coordinates (and rotation?) of entity',
            ENTITY_TYPES: [
                DMA, UAV, HELICOPTERS
            ],
            AGENTS: [USER, API]
        },
        MAP_CENTER: {
            TYPE: MAP_CENTER,
            DESC: 'Change map camera view to center on the entity',
            ENTITY_TYPES: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        },
        SET_ENTITY_CESIUM_ID : {
            TYPE: SET_ENTITY_CESIUM_ID,
            DESC: 'add generated cesiumId to added object in the store',
            ENTITY_TYPES: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        },
        TOGGLE_ENTITY_TYPE: {
            TYPE: TOGGLE_ENTITY_TYPE,
            DESC: 'Turn on/off entityType on the map',
            ENTITY_TYPES: [
                DMA, UAV, HELICOPTERS, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        },
        TOGGLE_BEST_FIT_DISPLAY: {
            TYPE: TOGGLE_BEST_FIT_DISPLAY,
            DESC: 'Turn on/off best fit zoom on object',
            ENTITY_TYPES: [
                DMA, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        }
    }
};
