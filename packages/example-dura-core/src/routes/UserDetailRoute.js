import React, {Component} from 'react';
import { connect } from "react-redux"

class UserDetailRoute extends Component {
    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
            </div>
        );
    }
}

const mapStateToProps = function (state) {
    return ({
        name: state?.user?.name
    })
}

export default connect(mapStateToProps)(UserDetailRoute);
