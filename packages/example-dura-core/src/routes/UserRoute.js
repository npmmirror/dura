import React, {Component} from 'react';
import {connect} from 'react-redux'

class UserRoute extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        name: state?.user?.name
    }
}


export default connect(mapStateToProps)(UserRoute);
