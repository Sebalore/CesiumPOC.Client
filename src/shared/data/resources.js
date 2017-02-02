import React, { Component, PropTypes, Children } from 'react';
import axios from 'axios';
import config from 'config.json';

let fetching = false;
let resources = undefined;

const rd_resolves = [],
        rd_rejects = [];


const  loadResourcesDataPromise = (resolve, reject) => {
    if (resources) {
        resolve(resources);
    } else {
        rd_resolves.push(promise);
        rd_rejects.push(reject);
        if (!fetching) {
            let error;
            fetching = true;
            axios.get(config.server.url + "/resources")
            .then(data => {
                resources = data;
                if (thisOne.state) {
                    thisOne.setState({resources});
                }
            })
            .catch(err => error = err)
            .then(()=> {
                fetching = false;
                if (error) {
                    rd_resolves = [];
                    while(rd_rejects.length>0) {
                        rd_rejects.pop()(error);
                    }
                } else {
                    rd_rejects = [];
                    while(rd_resolves.length>0) {
                        rd_resolves.pop()(resources);
                    }            
                }
            });
        }
    }
}

class ResourceProvider extends Component {

    constructor(props) {
        super(props);
        this.loadResourcesData();
    }
 
    
    static propTypes = {
        theme: PropTypes.object.isRequired,
    }

    getInitialState(){
        return {
            resources
        }
    }

    loadResourcesData() {
        return new Promise((resolve, reject) => loadResourcesDataPromise(resolve, reject));
    }

    get resources () {
       return resources;
    }

    componentDidMount(){
        this.loadResourcesData().then(resources => this.setState({resources}));
    }

    componentWillReceiveProps(nextProps){
        this.loadResourcesData().then(resources => this.setState({resources}));
    }    
  // you must specify what you’re adding to the context
  static childContextTypes = {
    theme: PropTypes.object.isRequired,
  }
  
  getChildContext() {
      return resources;
  }

  render() {

      // Handle case where the response is not here yet
      if (fetching) {
         //TODO: a spinner or something...
         return <div>The resources are comming!</div>
      }

      if (!resources) {
          return <div>Some problem with fetching resources</div>;
      } 


      // Normal case         
     return Children.only(this.props.children)
  }
}

export default ResourceProvider;