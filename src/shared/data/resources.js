const  UAV  = 'UAV';
const  DMA = 'DynamicMissionArea';

<<<<<<< HEAD
export const resources =  {
    UAV: UAV,
    DMA: DMA,
    IMG : {
        BASE_URL: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391',
        SCALE: '25%',
        MAX_WIDTH: '65px',      
        MAX_HEIGHT: '45px',

    },
    LAYERS: {
        [DMA]: {
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new destination point'
                }
            }
        },
        [UAV]: {
            ACTIONS: {
                ADD: {
                    ID: 'Add',
                    DESC: 'Add a new UAV'
                }
            }
        }        
    }
};

module.exports = resources;
=======
const resources =  {
   UAV: UAV,
   DMA: DMA,
   BASE_IMG_URL: 'http://res.cloudinary.com/dn0ep8uy3/image/upload/v1476363391',
   IMG_SCALE: 25,
   LAYERS: {
       [DMA]: {
           ACTIONS: {
               ADD: {
                   ID: 'Add',
                   DESC: 'Add a new destination point'
               }
           }
       },
       [UAV]: {
           ACTIONS: {
               ADD: {
                   ID: 'Add',
                   DESC: 'Add a new UAV'
               }
           }
       }        
   }
};

module.exports = resources;
>>>>>>> d2bb99f7da83f841879b231275d2dc8c6217d8b0
