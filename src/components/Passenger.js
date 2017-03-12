/**
 * Created by sammy on 17/3/11.
 */

require('styles/User.sass');

import React from 'react';
import axios from 'axios'
import $ from 'jquery'
import Left from './layout/Left'
import GDMap from './GDMap'

let map = null;
var timer = null;
var user = null;
var count2 = 0;
var count3 = 0;
var count0 = 0;

class Passenger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmit: false,
      // isAccept: false,
      message: [],
    };

    this.confirmOrder = this.confirmOrder.bind(this);
    this.pollGetState = this.pollGetState.bind(this);
  }

  componentDidMount() {
    user = JSON.parse(localStorage.getItem(window.localStorage_pass_key));
  }

  // 乘客点击确认打车
  confirmOrder(from, to) {

    if (!user) {
      alert("您还尚未登录，无法打车");
      return;
    }

    var point = {
      departure : {
        name: from,
        lng: "",
        lat: ""
      },
      destination : {
        name: to,
        lng: "",
        lat: ""
      }
    }
    var departureCode;
    var marker, lineArr = [];
    var geocoder;

    var map = new AMap.Map("myMap", {
      resizeEnable: true,
      // center: [116.397428, 39.90923],
      zoom: 20
    });

    var geocoder = new AMap.Geocoder({
      radius: 1000
    });

    var drivingOption = {
      policy: AMap.DrivingPolicy.LEAST_TIME
    };
    var driving = new AMap.Driving(drivingOption);

    // get geocode
    geocoder.getLocation(point.departure.name, (status, result) => {
    if (status === 'complete' && result.info === 'OK') {

      point.departure.lng = result.geocodes[0].location.getLng();
      point.departure.lat = result.geocodes[0].location.getLat();

      departureCode=new AMap.LngLat(point.departure.lng, point.departure.lat);
      //console.log(departureCode)
      marker.setPosition(departureCode)

      geocoder.getLocation(point.destination.name, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {

          point.destination.lng = result.geocodes[0].location.getLng();
          point.destination.lat = result.geocodes[0].location.getLat();

          // departureCode=new AMap.LngLat(point.departure.lng, point.departure.lat);
          // //console.log(departureCode)
          // marker.setPosition(departureCode)

          axios.post(window.url + "/chaincode", {
            "jsonrpc": "2.0",
            "method": "invoke",
            "params": {
              "type": 1,
              "chaincodeID": {
                "name": window.chaincodeID
              },
              "ctorMsg": {
                "function": "submit",
                "args": [
                  user.username,
                  user.password,
                  point.departure.lng + "",
                  point.departure.lat + "",
                  point.destination.lng + "",
                  point.destination.lat + "",
                  Date.parse(new Date())/1000 + "",
                  point.departure.name,
                  point.destination.name
                ]
              },
              "secureContext": window.localStorage_nodeUser_value
            },
            "id": 3
          }).then((res) => {
            if (res.status == 200 && res.statusText == "OK" && res.data.result && res.data.result.status == "OK") {
              console.log("成功提交订单...正在等待车辆...");
              this.setState({
                isSubmit: true,
                message: this.state.message.concat(["Please waiting for driver..."]),
              });

              //  轮询查看状态
              timer = setInterval(this.pollGetState, 1000);
            } else {
              console.log(res);
            }

          }).catch((err) => {
            console.error(err)
          })
        } else {
          alert(result.info)
        }
      });


    } else {
      alert(result.info)
    }
    });


    marker = new AMap.Marker({
      map: map,
      // position: new AMap.LngLat(result.geocodes[0].location.getLng(), result.geocodes[0].location.getLat()),
      icon: "http://webapi.amap.com/images/car.png",
      offset: new AMap.Pixel(-26, -13),
      autoRotation: true
    });



    driving.search([{
      keyword: point.departure.name
    }, {
      keyword: point.destination.name
    }], function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      (new Lib.AMap.DrivingRender()).autoRender({
      data: result,
      map: map,
      // panel: "panel"
      });
      var paths = [];

      for (var i = 0; i < result.routes[0].steps.length; i++) {
        paths = paths.concat(result.routes[0].steps[i].path);
      }
      lineArr = paths;
    } else {
      alert(result);
    }
    });


    // 绘制轨迹
    var polyline = new AMap.Polyline({
    map: map,
    path: lineArr,
    strokeColor: "#00A", //线颜色
    // strokeOpacity: 1,     //线透明度
    strokeWeight: 3, //线宽
    // strokeStyle: "solid"  //线样式
    });

    marker.on('moving', function (e) {
    polyline.setPath(e.passedPath);
    })
    map.setFitView();

    AMap.event.addDomListener(document.getElementById('start'), 'click', function () {
        marker.moveAlong(lineArr, 5000);
      }, false);
  }

  pollGetState() {
    // todo 2. 等待司机接单（轮询自身状态请求），
    axios.post(window.url + "/chaincode", {
      "jsonrpc": "2.0",
      "method": "query",
      "params": {
        "type": 1,
        "chaincodeID": {
          "name": window.chaincodeID
        },
        "ctorMsg": {
          "function": "getpassstate",
          "args": [
            user.username
          ]
        },
        "secureContext": "user_type1_0"
      },
      "id": 3
    }).then((res) => {
      //  若有司机接单，等待司机接送。
      if (res.status == 200 && res.statusText == "OK" && res.data.result) {
        if (res.data.result.message == 2) {
          count2++;
          if (count2 == 1) {
            this.setState({
              message: this.state.message.concat(["Driver has accepted! Please wait for picking up..."]),
            })
          }

        } else if (res.data.result.message == 3){
          //  司机接到乘客
          count3++;
          if (count3 == 1) {
            this.setState({
              message: this.state.message.concat(["You have been picked up! Start traveling..."]),
            })
            // 乘客界面小车动起来！
            $("#start").trigger('click',() => {
              console.log("car move!");
            })
          }
        } else if (res.data.result.message == 0){
          // 结束轮询
          window.clearInterval(timer)
          count0++;
          if (count0 == 1) {
            this.setState({
              message: this.state.message.concat(["Finish travel！"]),
              // isSubmit: false,
            })
            //  弹窗显示余额、最新一次打车费用、里程
            axios.post(window.url + "/chaincode", {
              "jsonrpc": "2.0",
              "method": "query",
              "params": {
                "type": 1,
                "chaincodeID": {
                  "name": window.chaincodeID
                },
                "ctorMsg": {
                  "function": "balance",
                  "args": [
                    user.username, user.password
                  ]
                },
                "secureContext": "user_type1_0"
              },
              "id": 3
            }).then((res2) => {
              if (res2.status == 200 && res2.statusText == "OK" && res2.data.result) {
                let balanceRes = JSON.parse(res2.data.result.message)
                alert("(Passenager) Current balance: "+balanceRes.balance/100+"\nDistance: "+ balanceRes.distance+"公里\nDuration: "+balanceRes.duration/60+"分钟\nTotal fee: "+(balanceRes.actFeeDistance + balanceRes.actFeeDuration)/1000+"元")
              } else {
                alert("get balance error!");
                console.log(res2);
              }
            }).catch((err) => {
                console.error(err)
            })
          }
        }
      }

    }).catch((err) => {

    })
  }


  startDrive() {

  }


  render() {

    let winHeight;

    //获取窗口高度
    if (window.innerHeight)
      winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
      winHeight = document.body.clientHeight;

    let stylObj = {
      height: winHeight,
    };

    return (
      <div className="wrapper" style={stylObj}>
        <Left status="passenger" confirmOrder={this.confirmOrder} startDrive={this.startDrive}
              message={this.state.message} isSubmit={this.state.isSubmit} onChange={val => this.setState({isSubmit: val})}/>
        <GDMap/>
      </div>
    )
  }
}

Passenger.defaultProps = {
};

export default Passenger;
