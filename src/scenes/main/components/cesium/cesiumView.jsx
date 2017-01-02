// Base Imports
import React from 'react';
import path from 'path';

// ---------------------------------------------Cesium Imports----------------------------------------------------

//----------------!!!!Cesium sources setup!!!!! -------------------------------
///!!! Reuired for Webpack.!!!!!
///Ensure that BUILD_DIR points to the right folder 
///and that the Cesium files are copied there from /node_modules/cesium/Build/Cesium
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
BuildModuleUrl._cesiumScriptRegex = /(.*?)\/Cesium\w*\.js(?:\W|$)/i;
const BUILD_DIR = path.resolve(__dirname, 'dist');
BuildModuleUrl.setBaseUrl(BUILD_DIR);
//-----------------------------------------------------------------------------

// Set Cesium default key to avoid warning on screen.
import BingMapsApi from 'cesium/Source/Core/BingMapsApi';
BingMapsApi.defaultKey = 'ApKtWGAVLWzzHvuvGZFWTRIXrsyLJ5czBuu9MkIGAdWwsQpXz_GiC55jbSnI43Qq';

//various Cesium objects
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer';
import JulianDate from 'cesium/Source/Core/JulianDate';
import Entity from 'cesium/Source/DataSources/Entity';
import Cartesian2 from 'cesium/Source/Core/Cartesian2';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import Rectangle from 'cesium/Source/Core/Rectangle';
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler';
import 'cesium/Source/Widgets/widgets.css';
import Math from 'cesium/Source/Core/Math';
import CustomDataSource from 'cesium/Source/DataSources/CustomDataSource.js';
import DataSourceCollection from 'cesium/Source/DataSources/DataSourceCollection.js';
import LabelGraphics from 'cesium/Source/DataSources/LabelGraphics.js';

import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType.js';

import {resources} from '../../../../shared/data/resources.js'; 

// --------------------------------------------------------------------------------------------------------------

// Consts
const componentStyle = {
    general: {
        width: '100vw',
        height: '95vh', // the upperBarView height is 6 vh.
    },
    fullSizeDimentions: {
        height : '95%',
        width: '95%',
        margin: '5px auto'
    },
    altimeter : {
        position: 'relative',
        top: '-70vh',
        marginLeft: '120px'
    },
    tooltip : {
        position: 'relative',
        width: '188px',
        height: '43px',
        background: 'white',
        border: '1px solid #47494c',
        borderRadius: '5px',
        top: '-110vh',
        left: '-1vw',
        marginLeft: '300px',
        visibility: 'hidden',
        textAlign: 'center',
    }
};

const initialViewState = {
    // id: 'af3e91b2-3ff0-4adf-2a29-23649c017542', // Guid.create(),
    activeLayer: null,
    layers: [],
    zoomHeight: 20000,
    center: {
      x: 34.99249855493725,
      y:  32.79628841345832,
    },
    options: {
        timeline: false,
        animation: false,
        fullscreenButton: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        shadows: false,
        sceneModePicker: false,
        sceneMode: 3, //Cesium.SceneMode.SCENE3D
        selectionIndicator: false,
        baseLayerPicker: false,
        geocoder: false,
    }
};

export default class CesiumView extends React.Component {

    constructor(props) {
        super(props);
        // class members
        this.viewState = initialViewState;
        this.dataSources = [];

        // class methods
        this.moveEntity = this.moveEntity.bind(this);
        this.mapDataSources = this.mapDataSources.bind(this);
        this.mapEntitiesArrayToEntityCollection = this.mapEntitiesArrayToEntityCollection.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.addDataSourceLayerByType = this.addDataSourceLayerByType.bind(this);
        this.handleContextAwareActions = this.handleContextAwareActions.bind(this);
    }

    componentDidMount() {

        let entity, selectedEntity;
        const dragging = false, isFirstClick = true;

        this.viewer = new CesiumViewer(this.refs.map, this.viewState.options);
        this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);  

        // subscribe viewer entities
        // this.viewer.entities.collectionChanged.addEventListenter( (collection, added, removed, changed) => console.log('entities collection changed!'));

        // map the data sources from the layers
        this.mapDataSources();

        this.setMapEventHandlers(this.viewer, this.handler, entity, selectedEntity, dragging, isFirstClick);

        // move to the default map
        this.setNewFocusOnMap(this.viewState.center.x, this.viewState.center.y);
    }

    handleContextAwareActions(error, eventData) {
        return new Promise((resolve, reject) => {
            if (error) {
                reject(error);
            } else {
                const ds = this.viewer.dataSources;
                const layerDataSource = ds.get(Array.from(ds).findIndex((fuckThis, i) => ds.get(i).name===eventData.data.layerName));                               
                switch (eventData.type) {
                    case resources.ACTIONS.TOGGLE_LAYER.TYPE: {
                        const layerIdx = this.props.layers.findIndex(l => l.name === eventData.data.layerName);
                        if(this.props.layers[layerIdx].active) {
                            this.addDataSourceLayerByType(layerIdx);
                        }
                        else {
                            this.removeDataSourceLayerByType(layerIdx);
                        }
                        break;   
                    } 
                    case resources.ACTIONS.DELETE.TYPE: {
                        if(eventData.agent === resources.AGENTS.USER) {
                            layerDataSource.entities.removeById(eventData.data.cesiumId);
                        }
                        break;
                    }                    
                    case resources.ACTIONS.ADD.TYPE:
                    case resources.ACTIONS.UPDATE_POSITION.TYPE: {
                        if(eventData.agent === resources.AGENTS.API) {
                            if (eventData.type === resources.ACTIONS.UPDATE_POSITION.TYPE) {
                                const entityToUpdate = layerDataSource.entities.getById(eventData.result.cesiumId);
                                layerDataSource.entities.remove(entityToUpdate);                                
                            }
                            const addedEntity = layerDataSource.entities.add(this.generateEntity(eventData.result.position, eventData.result.billboard));
                            
                            console.log(`Added new entity at : ${JSON.stringify(addedEntity.position.getValue(JulianDate.now()))}`);

                            this.props.actions[resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](
                                resources.AGENTS.USER,
                                {
                                    layerName: eventData.data.layerName,
                                    entityId: eventData.result.id,
                                    cesiumId: addedEntity.id
                                });
                        }
                        break;
                    }
                }
                resolve(eventData);
            } 
        });
    }

    /**
     * add one data source to the viewer by his type
     * @param {Number} layerIdx the layer index to add
     */
    addDataSourceLayerByType(layerIdx) {
        if(!this.viewer.dataSources.contains(this.dataSources[layerIdx])) {
            this.viewer.dataSources.add(this.dataSources[layerIdx]);
        }
    }

    /**
     * remove one data source to the viewer by his type
     * @param {Number} layerIdx the layer index to remove
     */
    removeDataSourceLayerByType(layerIdx) {
        const toDestroyDataSource = false;
        this.viewer.dataSources.remove(this.dataSources[layerIdx], toDestroyDataSource);
    }

    /**
     * move on entity on the map
     * @param {entityId} String
     * @param {Object} newEntityPosition
     */
    // TODO: change it to update instead of remove and adding
    moveEntity(entityId, newEntityPosition) {
        const entityToMove = this.viewer.entities.getById(entityId);
        // entityToMove.position = newEntityPosition;
        
        this.viewer.entities.remove(entityToMove);
        this.viewer.entities.add(this.generateEntity(newEntityPosition, entityToMove.billboard));
    }

    /**
     * this function maps the entities from each layer to be data sources for the viwer object
     */
    mapDataSources() {
        for(const layer of this.props.layers) {
            if(layer.entities.length > 0) { // if there are any entities in that layer
                // init data source to add
                const currentDataSourceToAdd = new CustomDataSource(layer.name);
                // init the data source entities
                this.mapEntitiesArrayToEntityCollection(layer.entities, currentDataSourceToAdd);
                // add the data source to the data source collection
                this.viewer.dataSources.add(currentDataSourceToAdd);
                // add the data source locally to hold ALL the data sources. it is required because when we hide layer we actually remove data source from cesium.
                this.dataSources.push(currentDataSourceToAdd);
            }
        }
    }

    /**
     * map given entities array managed by our structure to cesium CustomDataSource object
     * @param {Array} srcEntities
     * @param {CustomDataSource} entCollection the collection to enter to
     */
    mapEntitiesArrayToEntityCollection(srcEntities, entCollection) {
        for(let i = 0 ; i < srcEntities.length ; i++) {
            const entity = srcEntities[i];
            const addedEntity = entCollection.entities.add(this.generateEntity(entity.position, entity.billboard));

            if(entity.hasOwnProperty('label') && entity.label && entity.label !== 'undefined') {
                addedEntity.label = new LabelGraphics({
                    text: entity.label,
                    show: false
                });
            }

            this.props.actions[resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](
                resources.AGENTS.USER, {
                    layerName: entCollection.name,
                    entityId: entity.id,
                    cesiumId: addedEntity.id
                }
            );
        }
    }

        // /**
        //  * generate entity by params
        //  * @param {Number} longitude
        //  * @param {Number} latitude
        //  * @param {Number} height
        //  * @param {String} imgSource
        //  * @param {Number} imgScale
        //  * @returns {Object} an object that can be added to cesium entities collection
        //  */
        // _generateEntity(longitude, latitude, height, imgSource, imgScale) {
        //     return {
        //             position: Cartesian3.fromDegrees(longitude, latitude, height),
        //             billboard: {
        //                 image: imgSource,
        //                 scale: imgScale   
        //             }
        //     };
        // }

    /**
     * generate entity by params
     * @param {position} a position object containinf longitude and latitude in degrees (or radians?) and height in meters
     * @param {billboard} billboard object
     * @returns {Object} an object that can be added to cesium entities collection
     */
    generateEntity(position, billboard) {
        return {
                position: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
                billboard
        };
    }

    setMapEventHandlers(viewer, handler, entity, selectedEntity, dragging, isFirstClick) {
            
            // Drag & Drop 
            handler.setInputAction( click => 
            {
                const pickedObject = viewer.scene.pick(click.position);
                
                if (this.defined(pickedObject)) 
                {
                    entity = pickedObject.id;
                    //entity.billboard.scale = 1.2;
                    dragging = true;
                    viewer.scene.screenSpaceCameraController.enableInputs = false;
                }
            }, ScreenSpaceEventType.LEFT_DOWN);

            // dragging handler
            handler.setInputAction( movement => 
            {
                const tooltipInfo = this.refs.movementToolTip;

                if (dragging) 
                {
                    entity.position = viewer.camera.pickEllipsoid(movement.endPosition);
                }
                else {
                    const pickedObject = viewer.scene.pick(movement.endPosition);

                    if (this.defined(pickedObject)) {
                        
                        tooltipInfo.style.visibility = 'visible';
                        
                        tooltipInfo.innerHTML = pickedObject.hasOwnProperty('label') && pickedObject.label && pickedObject.label !== 'undefined' ? 
                            pickedObject.id.label.text._value : 'This is a mock basic details about this entity';
                    }
                }

            }, ScreenSpaceEventType.MOUSE_MOVE);

            // mouse up handler
            handler.setInputAction( () => 
            {
                   
                dragging = false;
                viewer.scene.screenSpaceCameraController.enableInputs = true;

            }, ScreenSpaceEventType.LEFT_UP);
           
           //click two times animation handler
            handler.setInputAction( click => 
            {
                if(!dragging)
                {
                    if (isFirstClick) // if first click on object
                    {
                        const pickedObject = viewer.scene.pick(click.position);

                        if (this.defined(pickedObject)) 
                        {
                            selectedEntity = {
                                id: pickedObject.id._id,
                                entity: pickedObject.id, 
                                x: click.position.x, 
                                y: click.position.y 
                            };

                            this.clickType = false;
                        }
                    }
                    else // if second click on object
                    {
                        const isRemoveWasSucceded = viewer.entities.removeById(selectedEntity.id);
                        isFirstClick = true;
                    }
                }   // end if !dragging

            }, ScreenSpaceEventType.LEFT_CLICK);

            // left click on entity handler
            handler.setInputAction( click => 
            {
                const pickedObject = viewer.scene.pick(click.position);
                
                if (this.defined(pickedObject)) 
                {
                    entity = pickedObject.id;
                    console.log('you right click on ', entity);
                }

            }, ScreenSpaceEventType.RIGHT_DOWN);
    }

    defined(object) {
        return (object !== undefined && object !== null);
    }

    /** change the map center view - action like fly to given coordinates */
    setNewFocusOnMap(x, y)    {
        this.viewer.camera.lookAt(Cartesian3.fromDegrees(x, y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
    }

    /** the function handle droping entities from this combobox to the map */
    onDrop(event)    {

        // calculate new object drop area
        // const t = this.viewer.entities;
        const dim = this.refs.map.getClientRects()[0];
        const x = (event.clientX - dim.left);
        const y = (event.clientY - dim.top);

        // add the new object to the map
        const mousePosition = new Cartesian2(x, y);
        let cartesian = mousePosition;
        if (this.viewer.scene.mode === 3) {
            //Cesium.SceneMode.SCENE3D 
            cartesian = this.viewer.camera
            .pickEllipsoid(mousePosition, this.viewer.scene.globe.ellipsoid); // maybe the problem here!!
        }

     
        const img = document.getElementById(event.dataTransfer.getData('text'));
        //console.log(img);

        if (cartesian && img) {
            const cartographic =  this.viewer.scene.globe.ellipsoid
                                    .cartesianToCartographic(cartesian);
            const longitudeString = Math.toDegrees(cartographic.longitude);
            const latitudeString = Math.toDegrees(cartographic.latitude);

            // TODO: use generateEntity()
            const cesiumEntity = {
                position: Cartesian3.fromDegrees(longitudeString, latitudeString, 1.0),
                billboard: {
                    image: img.src,
                    scale: img.clientHeight /100   
                }
            };

            // add the entity to the map
            this.viewer.entities.add(cesiumEntity);

            this.setState({entities: this.viewer.entities.values.map((entity) => {
                return {
                        position: entity.position.getValue(JulianDate.now()),
                        billboard: {
                        image: entity.billboard.image.getValue(),
                        scale: entity.billboard.scale.getValue() 
                    }  
                };
            })});
        } else {
            console.log('CesiumView::onDrop(event) : something went wrong.');
        }
    }

    render() {

        return (
            <div style = {componentStyle.general}>
                <div id="general" ref="general" style = {componentStyle.fullSizeDimentions}>
                    <div style = {componentStyle.fullSizeDimentions} id="map"className="map" ref="map" onDragOver= { (e) => e.preventDefault() } onDrop={this.onDrop}>
                    </div>
                </div>
                <img style = {componentStyle.altimeter} src="https://s27.postimg.org/op4ssy0ur/altimeter.png" alt="altimeter"/>
                <div style = {componentStyle.tooltip} ref="movementToolTip" id="movementToolTip" onClick = {() => {this.refs.movementToolTip.style.visibility = 'hidden';}}/>
            </div>
        );
    }
}

CesiumView.propTypes = {
    layers : React.PropTypes.array,
    activeLayer : React.PropTypes.object,
    onAddEntity : React.PropTypes.func,
    onRemovEntity : React.PropTypes.func,
    onUpdateEntityPosition : React.PropTypes.func
};

