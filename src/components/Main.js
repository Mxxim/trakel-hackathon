require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import axios from 'axios';
import Home from './Home'

window.localStorage_driver_key = "driver";
window.localStorage_pass_key = "pass";
window.url = "https://046e5e8921864ed598d18e5301c3aaf5-vp3.us.blockchain.ibm.com:5003";
window.chaincodeID = "f4e6dc13c1de98ffd71c98875749b55ae0741fa5d51bf67d171eb9cf60934048ebef939f368ec8b2e4311ab7a5716b57c13d1969d34e6d34df257000361fddda";
window.localStorage_nodeUser_value = "user_type1_0";


class AppComponent extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
      axios.post(window.url + "/registrar", {
        "enrollId": window.localStorage_nodeUser_value,
        "enrollSecret": "57a48fda9b"
      }).then((res) => {
        if (res.status == 200 && res.statusText === "OK" && res.data.OK) {
          // localStorage.setItem(localStorage_nodeUser_key, localStorage_nodeUser_value);
        } else {
          alert("Enroll error!");
          console.log(res);
        }
      }).catch((err) => {
        alert("Enroll error!");
        console.error(err);
      })
  }

  render() {



    return (
      <div>
        {this.props.children || <Home/>}
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
