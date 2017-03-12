/**
 * Created by sammy on 17/3/11.
 */

import React from 'react';

import Header from './Header'

let headerDatas = require('../data/header.json');


// 利用自执行函数，将头部图片信息转换成图片url路径信息
let headerDtasWithImgURL = ((headerDatas) => {
  for (let key in headerDatas) {
    if (key == 'logo') {
      if (headerDatas[key]['imgName']) {
        headerDatas[key]['imgURL'] = require('../images/' + headerDatas[key]['imgName']);
      }
    }
  }
  if (headerDatas['backgroundImgName']) {
    headerDatas['backgroundImgURL'] = require('../images/' + headerDatas['backgroundImgName']);
  }

  return headerDatas;
})(headerDatas);

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header headerData = {headerDtasWithImgURL}/>
      </div>
    );
  }
}

Home.defaultProps = {
};

export default Home;
