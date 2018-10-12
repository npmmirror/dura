import React, { Component } from "react";
import { connect } from "react-redux";

class UserRoute extends Component {
  render() {
    console.log(this.props.duraCorePro);
    return (
      <div>
        <h1>{this.props.name}</h1>
        <button
          onClick={() => {
            this.props.dispatch({
              type: "user/reducers/onChangeName",
              payload: {
                name: "李四"
              }
            });
            import("./test-util").then(n => n.hello());
          }}
        >
          变名字
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    name: state?.user?.name
  };
}

export default connect(mapStateToProps)(UserRoute);
