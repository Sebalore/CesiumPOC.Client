// Base Imports
import React from 'react';
import path from 'path';
import Guid from 'guid';


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
//import JulianDate from 'cesium/Source/Core/JulianDate';
//import Entity from 'cesium/Source/DataSources/Entity';
import Cartesian2 from 'cesium/Source/Core/Cartesian2';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler';
import 'cesium/Source/Widgets/widgets.css';
import Math from 'cesium/Source/Core/Math';
import CustomDataSource from 'cesium/Source/DataSources/CustomDataSource.js';
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
        // width: '95%',
        margin: '5px auto'
    },
    map : {
        height: '95%',
        width: '91vw',
        margin: '0 auto',
    },
    altimeter : {
        position: 'relative',
        top: '-70vh',
        marginLeft: '120px'
    },
    tooltip : {
        display: 'block',
        position: 'fixed',
        overflow: 'hidden',
        width: '188px',
        height: '43px',
        background: 'white',
        border: '1px solid #47494c',
        borderRadius: '5px',
        visibility: 'hidden',
        textAlign: 'center',
    },
    editEntityForm: {
        width: '234px',
        top: '-671px',
        left: '221px',
        height: '200px',
        backgroundColor: '#aaaaaa',
        position: 'relative',
        visibility: 'hidden',
  },
  formH1: {
    background: '#615a5a',
    borderBottom: '1px solid black',
    textAlign: 'center'
  }
};

const initialViewState = {
    activeLayer: null,
    layers: [],
    zoomHeight: 20000,
    center: {
      x: resources.MAP_CENTER.longitude,
      y: resources.MAP_CENTER.latitude,
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
        this.isZoomedToBestFit = false;

       // class methods
        this.onDrop = this.onDrop.bind(this);
        this.handleContextAwareActions = this.handleContextAwareActions.bind(this);
    }

    componentDidMount() {

        let entity, selectedEntity;
        const dragging = false, isFirstClick = true;

        this.viewer = new CesiumViewer(this.refs.map, this.viewState.options);
        this.viewer.camera.lookAt(Cartesian3.fromDegrees(this.viewState.center.x, this.viewState.center.y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));

        this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);  

        // subscribe viewer entities
        // this.viewer.entities.collectionChanged.addEventListenter( (collection, added, removed, changed) => console.log('entities collection changed!'));

        // map the data sources from the layers
        this.props.layers.forEach(layer => this.createLayerDataSource(layer));

        this.setMapEventHandlers(this.viewer, this.handler, entity, selectedEntity, dragging, isFirstClick);
    }

    handleContextAwareActions(error, eventData) {
        return new Promise((resolve, reject) => {
            if (error) {
                reject(error);
            } else {
                const ds = this.viewer.dataSources;
                const layerIdx = this.props.layers.findIndex(l => l.name === eventData.data.layerName);
                const layerIsActive = layerIdx> -1 && this.props.layers[layerIdx].active;               
                const layerDataSource = ds.get(Array.from(ds).findIndex((fuckThis, i) => ds.get(i).name===eventData.data.layerName));

                switch (eventData.type) {
                    case resources.ACTIONS.TOGGLE_LAYER.TYPE: {
                        layerDataSource.show = !layerDataSource.show;
                        break;   
                    } 
                    case resources.ACTIONS.DELETE.TYPE: {
                        if (layerIsActive) {
                            if(eventData.agent === resources.AGENTS.USER) {
                                if (layerDataSource && layerDataSource.entities) {
                                    layerDataSource.entities.removeById(eventData.data.cesiumId);
                                }
                            }
                        }
                        break;
                    }                    
                    case resources.ACTIONS.ADD.TYPE:
                    case resources.ACTIONS.UPDATE_POSITION.TYPE: {
                        if (layerIsActive) {
                            if (eventData.type === resources.ACTIONS.UPDATE_POSITION.TYPE) {
                                const entityToUpdate = layerDataSource.entities.getById(eventData.result.cesiumId);
                                layerDataSource.entities.remove(entityToUpdate);   

                                // real update
                                // TODO: uncomment when we have replay from cesium forum

                                // console.log('------------------------change entity position------------------');
                                // console.log('before: ', entityToUpdate.position);
                                // entityToUpdate.position = Cartesian3.fromDegrees(eventData.data.position.latitude, eventData.data.position.longitude, 1000);                           
                                // console.log('after: ', entityToUpdate.position);                             
                            }

                            const addedEntity = layerDataSource.entities.add(this.generateEntity(eventData.result.position, eventData.result.billboard, {
                                label: new LabelGraphics({
                                    text: eventData.result.label || '...', 
                                    show: false
                                })
                            }));
                            
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
                    case resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE: {
                        console.assert(layerIsActive);
                        const entity = eventData.data.entity
                        if(!this.isZoomedToBestFit) {
                            this.viewer.zoomTo(entity, {
                                heading : 0,
                                pitch: -Math.PI/2,
                                range: this.viewState.zoomHeight/2  //TODO: calculate it according to entity size
                            });
                            entity.billboard.scale = 4; //TODO: calculate it according to entity size

                            this.isZoomedToBestFit = true;
                        } else {
                            //revert to default view
                            entity.billboard.scale = 1;
                            //this.viewer.zoomTo(Cartesian3.fromDegrees(this.viewState.center.x, this.viewState.center.y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
                            this.viewer.camera.lookAt(Cartesian3.fromDegrees(this.viewState.center.x, this.viewState.center.y), new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
                            this.isZoomedToBestFit = false;
                        }

                    }
                }

                resolve(eventData);
            } 
        });
    }

    /**
     * maps the entities array of a layer to a newly created cesium CustomDataSource object
     * @param {Object} layer the layer object
     */
    createLayerDataSource(layer) {
        const layerDataSource = new CustomDataSource(layer.name);
        layer.entities.map(e => {
            const cesiumEntity = layerDataSource.entities.add(this.generateEntity(e.position, e.billboard, {label: new LabelGraphics({text: e.label || 'nothing here', show: false})})); 
            this.props.actions[resources.ACTIONS.SET_ENTITY_CESIUM_ID.TYPE](
                resources.AGENTS.USER, {
                    layerName: layer.name,
                    entityId: e.id,
                    cesiumId: cesiumEntity.id
                }
            ); 

            // TODO: add manualy description, and add method to handle it
        //             cesiumEntity.description = '\
        // <img\
        //   width="50%"\
        //   style="float:left; margin: 0 1em 1em 0;"\
        //   src="//cesiumjs.org/images/2015/02-02/Flag_of_Wyoming.svg"/>\
        // <p>\
        //   Wyoming is a state in the mountain region of the Western \
        //   United States.\
        // </p>\
        // <p>\
        //   Wyoming is the 10th most extensive, but the least populous \
        //   and the second least densely populated of the 50 United \
        //   States. The western two thirds of the state is covered mostly \
        //   with the mountain ranges and rangelands in the foothills of \
        //   the eastern Rocky Mountains, while the eastern third of the \
        //   state is high elevation prairie known as the High Plains. \
        //   Cheyenne is the capital and the most populous city in Wyoming, \
        //   with a population estimate of 62,448 in 2013.\
        // </p>\
        // <p>\
        //   Source: \
        //   <a style="color: WHITE"\
        //     target="_blank"\
        //     href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
        // </p>';                                
        });

        this.viewer.dataSources.add(layerDataSource);
    }

    /**
     * generate entity by params
     * @param {position} a position object containinf longitude and latitude in degrees (or radians?) and height in meters
     * @param {billboard} billboard object
     * @returns {Object} an object that can be added to cesium entities collection
     */
    generateEntity(position, billboard, others) {
        const cesiumEntity =  {
                position: Cartesian3.fromDegrees(position.longitude, position.latitude, position.height),
                billboard,
                ...others
        };
        return cesiumEntity;
    }

    setMapEventHandlers(viewer, handler, entity, selectedEntity, dragging, isFirstClick) {
            
            // Get mouse position on screeמ (unrelated to Cesium viewer object)
            let x, y;
            window.onmousemove = function (e) {
                x = e.clientX;
                y = e.clientY;
            };                    

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
                        tooltipInfo.style.top = (y - 70) + 'px';
                        tooltipInfo.style.left = (x - 20) + 'px';                          
                        tooltipInfo.innerHTML = pickedObject.id.label ? pickedObject.id.label.text._value : '... add a toolptip for this object';

                        setTimeout(() => tooltipInfo.style.visibility = 'hidden', 7000);
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

            // // left click on entity handler
            // handler.setInputAction( click => 
            // {
            //     const pickedObject = viewer.scene.pick(click.position);
                
            //     if (this.defined(pickedObject)) {
            //         this.viewer.flyTo(pickedObject);
            //         const editForm = this.refs.entityEditionForm;
            //         const pickedObject = viewer.scene.pick(click.position);

            //         if (this.defined(pickedObject)) {
                        
            //             editForm.style.visibility = 'visible';
                        
            //             this.refs.entityNameInput.value = pickedObject.id.hasOwnProperty('_label') &&  pickedObject.id.label &&  pickedObject.id.label !== 'undefined' ? 
            //                 pickedObject.id.label.text._value : '... add a toolptip for this object';
            //         }
            //     }
            // }, ScreenSpaceEventType.RIGHT_DOWN);


            // left click on map
            handler.setInputAction( click => {
                const pickedObject = viewer.scene.pick(click.position);
                if (this.isZoomedToBestFit || this.defined(pickedObject)) {
                    this.props.actions[resources.ACTIONS.TOGGLE_BEST_FIT_DISPLAY.TYPE](resources.AGENTS.USER, {entity: pickedObject.id});
                } else {
                    const cartesian = this.viewer.camera.pickEllipsoid( click.position, this.viewer.scene.globe.ellipsoid);
                    this.viewer.camera.lookAt(cartesian, new Cartesian3(0.0, 0.0, this.viewState.zoomHeight));
                }
            }, ScreenSpaceEventType.RIGHT_UP);         
    }

    defined(object) {
        return (object !== undefined && object !== null);
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
            cartesian = this.viewer.camera.pickEllipsoid(mousePosition, this.viewer.scene.globe.ellipsoid); // maybe the problem here!!
        }
     
        const layerName = event.dataTransfer.getData('text');
        const layer = this.props.layers.find(l => l.name === layerName);
        //console.log(layerName);

        if (cartesian && layerName && layer) {
            const cartographic =  this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
            const longitudeString = Math.toDegrees(cartographic.longitude);
            const latitudeString = Math.toDegrees(cartographic.latitude);

            this.props.actions[resources.ACTIONS.ADD.TYPE](
                resources.AGENTS.USER,
                 {
                    id: Guid.create(),
                    layerName: layerName,
                    label: `${layerName}-New-Added`,
                    position: { 
                        height : 1000.0,            // TODO: change it 
                        latitude : latitudeString,
                        longitude : longitudeString,
                    },
                    billboard: {
                        image: `${resources.IMG.BASE_URL}${resources.LAYERS[layerName].ACTIONS.ADD.IMG}`,
                        scale: resources.LAYERS[layerName].ACTIONS.ADD.SCALE || 1
                    }                    
                });
        } else {
            console.log('CesiumView::onDrop(event) : something went wrong.');
        }
    }

    render() {

        return (
            <div style = {componentStyle.general}>
                <div id="general" ref="general" style = {componentStyle.fullSizeDimentions}>
                    <div style = {componentStyle.map} id="map"className="map" ref="map" onDragOver= { (e) => e.preventDefault() } onDrop={this.onDrop}>
                    </div>
                </div>
                <img style = {componentStyle.altimeter} src="https://s27.postimg.org/op4ssy0ur/altimeter.png" alt="altimeter"/>
                <div style = {componentStyle.tooltip} ref="movementToolTip" id="movementToolTip" /*onClick = {() => {this.refs.movementToolTip.style.visibility = 'hidden';}}*//>
                <form style={componentStyle.editEntityForm} ref="entityEditionForm" id="entityEditionForm" >
                    <h1 style={componentStyle.formH1}>Create some circle</h1>
                    <h2>Name:</h2>
                    <input type="text" name="Name" defaultValue="Name" ref="entityNameInput"/>
                    <br/><br/>
                    <input type="button" value="OK" onClick = {(e) => {e.preventDefault(); this.refs.entityEditionForm.style.visibility = 'hidden';}} />
                    <input type="button" value="Cancle" onClick = {(e) => {e.preventDefault(); this.refs.entityEditionForm.style.visibility = 'hidden';}} />
                </form >
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

