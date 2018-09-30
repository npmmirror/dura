import React, {Component} from 'react';
import {connect} from 'react-redux'

class OrderRoute extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.id}</h1>
            </div>
        );
    }
}

function mapStateToProps(state) {

    return ({
        id: state?.order?.id
    })
}


export default connect(mapStateToProps)(OrderRoute);
