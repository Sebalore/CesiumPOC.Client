// react imports
import React from 'react';

// redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// actions imports
import * as mainActions from '../Redux/actions/mainActions';

// sub components imports
import CesiumView from '../components/cesium/cesiumView';
import EntityTypes from '../components/entityTypes/entityTypesView';
import AddEntity from '../components/addEntity/addEntityView';

// utils
import {isEmptyObject, createLinearCoordinatesGenerator} from '../utills/services';

// resources
import {resources} from '../shared/data/resources';

class MainView extends React.Component
{
    componentDidMount() {
        this.props.actions.fetchAllLayersData();

        // setTimeout(() => {
        //     this.startUpdatePositionInterval(2000);
        // }, 5000);
    }

    startUpdatePositionInterval(intervalTimeToUpdate) {

        this.props.main.entityTypes.find(l => l.name===resources.ENTITY_TYPE_NAMES.AIRPLANE).entities.forEach(e =>{
            const gen = createLinearCoordinatesGenerator(e.position);
            setInterval(() => {
              const cords = gen.next();
                if(!cords.done) {
                    this.props.actions.setEntityPosition(e.id, cords.value);               
                }
            }, intervalTimeToUpdate);            
          });
          
          this.props.main.entityTypes.find(l => l.name===resources.ENTITY_TYPE_NAMES.HELICOPTER).entities.forEach(e =>{
            const gen = createLinearCoordinatesGenerator(e.position);
            setInterval(() => {
              const cords = gen.next();
                if(!cords.done) {
                    this.props.actions.setEntityPosition(e.id, cords.value);              
                }
            }, intervalTimeToUpdate);            
          });
    }

    setIconStyle(imgName) {
        const lastSlash = imgName.lastIndexOf('/');
        const parsedImage = imgName.substring(lastSlash + 1, imgName.length);
        const newStyle = JSON.parse(JSON.stringify(componentStyle.icon)); // deep cloning
        const concreteDisplay = `url(${resources.IMG.BASE_URL}${parsedImage}) no-repeat 50% 50%`;

        newStyle.WebkitMask = concreteDisplay;
        newStyle.mask = concreteDisplay;

        return newStyle;
    }

    render() {
        if (!isEmptyObject(this.props.main)) {
            return (
                <div className="mainContainer" style={componentStyle}>
                    <div style={componentStyle.mainComponentSon}>
                        <EntityTypes 
                            entityTypes={this.props.main.entityTypes} 
                            actions={this.props.actions} 
                            setIconStyle={this.setIconStyle}
                        />
                        <AddEntity
                            entityTypesInfo={this.props.main.addableEntityTypesInfo}
                            actions={this.props.actions}
                            setIconStyle={this.setIconStyle}
                        />
                    </div>
                    <CesiumView 
                        entityTypes={this.props.main.entityTypes} 
                        actions={this.props.actions}
                        ref='cesium'
                    />
                </div>
            );
            } 
            else {
                return ( <div>there is a problem, please refresh the page</div> );
            }
    }
}

//export default App;
export default connect(mapStateToProps, mapDispatchToProps)(MainView);

const componentStyle = {

  position: 'fixed',
  height: '100%',
  width: '100%',
  top: '0',
  left: '0',
  mainComponentSon: {
    top: '0',
    left: '0',
    fontSize: '30px',
    width: '91vw',
    height: '6vh',
    margin: '0 auto'
  },
  icon: {
    width: '48px',
    height: '100%',
    display: 'inline-block',
    WebkitMaskSize: 'cover',
    maskSize: 'cover',
    backgroundColor: 'white'
  },
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...mainActions }, dispatch)
  };
}

function mapStateToProps(state) {
  return {
    main: state.main
  };
}