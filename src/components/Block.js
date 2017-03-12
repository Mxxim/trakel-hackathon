/**
 * Created by sammy on 17/3/12.
 */

require("../styles/Block.sass")

import React from 'react';
import axios from 'axios';

class Block extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      latestNumber : 0,
      block: null,
    }

    this.getBlocks = this.getBlocks.bind(this);
  }

  componentDidMount() {
    setInterval(this.getBlocks, 1000);
    // this.getBlocks();
  }

  getBlocks() {
    axios.get(window.url+"/chain")
      .then((res) => {
      console.log(res);
      if (res.status == 200 && res.statusText == "OK" && res.data) {
          let latestNumber = res.data.height;
        this.setState({
          latestNumber: latestNumber,
        })
      } else {
        alert("get chain error!");
        console.log(res)
      }
    }).catch((err) => {
      alert("get chain error!");
      console.error(err);
    })
  }

  render() {
    return (
      <div>
        <h3>
          当前最新区块号：{this.state.latestNumber}
        </h3>
      </div>
    );
  }
}

Block.defaultProps = {
};

export default Block;
