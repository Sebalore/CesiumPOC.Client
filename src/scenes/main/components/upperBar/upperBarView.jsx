import React from 'react';
import Guid from 'guid';

export default class UpperBar extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <ul>
                    {this.props.images.map((imageUrl, idx) => 
                    <li key={idx}>
                        <img style={{maxWidth: 25 + '%', maxHeight: 25 + '%'}} 
                            id = {Guid.create()}
                            src={imageUrl}
                            draggable='true'
                            onDragStart={ (e) => { 
                                e.dataTransfer.setData('text/plain', e.target.id);
                            }}
                        />
                    </li>)}
                </ul>
            </div>
        );
    }
}

