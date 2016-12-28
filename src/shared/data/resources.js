const  UAV  = 'UAV';
const  DMA = 'DynamicMissionArea';

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