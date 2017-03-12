/**
 * Created by sammy on 17/3/12.
 */


import React from 'react';

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let lis = [];
    if (this.props.datas) {
      let len = this.props.datas.length;
      for (let i = 0;i < len; i++) {
        lis.push(<li>{this.props.datas[i]}</li>)
      }
    }

    return (
      <ul>
        {lis}
      </ul>
    )
  }
}

List.defaultProps = {
};

export default List;
