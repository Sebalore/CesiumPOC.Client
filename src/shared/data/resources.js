
//------LAYERS AND ENTITY TYPES NAMES --------------
const UAV = 'UAV';
const AIRPLANE = 'Airplane';
const HELICOPTER = 'Helicopter';

const DMA = 'DynamicMissionArea';
const FORBIDEN_FLIGHT_AREA = 'ForbidenFlightArea';
const FLIGHT_AREA = 'FlightArea';
const FLIGHT_CIRCLE = 'FlightCircle'; //layer
const FLIGHT_CIRCLE_IN = 'FlightCircle - Enter'; //entity type
const FLIGHT_CIRCLE_OUT = 'FlightCircle - Exit'; //entity type
const MISSION_TOOLTIP = 'MissionTooltip'; //entity type

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
    LAYER_NAMES: {
        UAV : UAV,
        DMA : DMA,
        FORBIDEN_FLIGHT_AREA : FORBIDEN_FLIGHT_AREA,
        FLIGHT_AREA : FLIGHT_AREA,
        FLIGHT_CIRCLE : FLIGHT_CIRCLE,         
    },
    ENTITY_TYPE_NAMES :{
        AIRPLANE : AIRPLANE,
        HELICOPTER : HELICOPTER,
        DMA : DMA,
        FORBIDEN_FLIGHT_AREA : FORBIDEN_FLIGHT_AREA,
        FLIGHT_AREA : FLIGHT_AREA,
        FLIGHT_CIRCLE_IN : FLIGHT_CIRCLE_IN, 
        FLIGHT_CIRCLE_OUT : FLIGHT_CIRCLE_OUT, 
        MISSION_TOOLTIP: MISSION_TOOLTIP
    },
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
        [FLIGHT_CIRCLE_IN]: {
            IMG: 'icon_1.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new flight circle.',
                    IMG: 'icon_11.svg',
                    SCALE: 1
                }
            }
        },
        [DMA]: {
            IMG: 'icon_8.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new destination point',
                    IMG: 'icon_8.svg',
                    SCALE: 0.5
                }
            }
        },
        [AIRPLANE]: {
            IMG: 'icon_5.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new AIRPLANE',
                    IMG: 'icon_5_black_1.svg',
                    SCALE: 0.5
                }
            }
        },
        [HELICOPTER]: {
            IMG: 'icon_3.svg',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new helicopter',
                    IMG: 'icon_3_black_1.svg',
                    SCALE: 0.5
                }
            }
        },
        [MISSION_TOOLTIP] : {
            IMG: 'circle_with_number_inside',
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new helicopter mission id tooltip',
                    IMG: 'circle_with_number_inside',
                    SCALE: 1
                }
            }
        }      
    },
    ACTIONS: {
        ADD: {
            TYPE: ADD,
            DESC: 'Add a new entity',
            LAYERS: [
                DMA, FLIGHT_AREA, FORBIDEN_FLIGHT_AREA, UAV, FLIGHT_CIRCLE
            ], //ON WHAT LAYERS CAN THIS ACTION BE PERFORMED
            AGENTS: [
                USER, API
            ], //WHOS CAN PERFORM ACTION
            IMG: 'entityType'
        },
        DELETE: {
            TYPE: DELETE,
            DESC: 'Delete an entity',
            LAYERS: [
                DMA, FLIGHT_AREA, FORBIDEN_FLIGHT_AREA, UAV, FLIGHT_CIRCLE
            ],
            AGENTS: [
                USER, API
            ],
            IMG: 'icon_7.svg'
        },
        UPDATE_POSITION: {
            TYPE: UPDATE_POSITION,
            DESC: 'Change position coordinates (and rotation?) of entity',
            LAYERS: [
                DMA, FLIGHT_AREA, FORBIDEN_FLIGHT_AREA, UAV
            ],
            AGENTS: [USER, API]
        },
        MAP_CENTER: {
            TYPE: MAP_CENTER,
            DESC: 'Change map camera view to center on the entity',
            LAYERS: [
                DMA, FLIGHT_AREA, FORBIDEN_FLIGHT_AREA, UAV, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        },
        TOGGLE_ENTITY_TYPE: {
            TYPE: TOGGLE_ENTITY_TYPE,
            DESC: 'Turn on/off layer and/or entity type on the map',
            LAYERS: [
                DMA, FLIGHT_AREA, FORBIDEN_FLIGHT_AREA, UAV, FLIGHT_CIRCLE
            ],
            AGENTS: [USER, API]
        },
        TOGGLE_BEST_FIT_DISPLAY: {
            TYPE: TOGGLE_BEST_FIT_DISPLAY,
            DESC: 'Turn on/off best fit zoom on object',
            LAYERS: [
                DMA, FLIGHT_AREA, FORBIDEN_FLIGHT_AREA, FLIGHT_CIRCLE
            ],
            AGENTS: [USER]
        }
    }
};
