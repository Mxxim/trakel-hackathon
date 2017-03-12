/**
 * Created by sammy on 17/3/11.
 */

require('styles/User.sass');

import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import Left from './layout/Left'
import GDMap from './GDMap'

var driver = null;
var timer = null;

class Driver extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      isSelected: false,
      message2: [],
    }

    this.pollGetOrders = this.pollGetOrders.bind(this);
    this.selectOrder = this.selectOrder.bind(this);
    this.pickUp = this.pickUp.bind(this);
    this.finish = this.finish.bind(this);
  }

  componentDidMount() {
    driver = JSON.parse(localStorage.getItem(window.localStorage_driver_key));
    var map = new AMap.Map("myMap", {
      resizeEnable: true,
      // center: [116.397428, 39.90923],
      zoom: 20
    });

    var marker = new AMap.Marker({
      position: [121.4998615563,31.2397013920]
    });

    marker.setMap(map);
    map.setFitView();


    // 司机轮询订单池
    timer = setInterval(this.pollGetOrders, 1000);

  }

  pollGetOrders() {

    console.log(driver);

    axios.post(window.url + "/chaincode", {
      "jsonrpc": "2.0",
      "method": "query",
      "params": {
        "type": 1,
        "chaincodeID": {
          "name": window.chaincodeID
        },
        "ctorMsg": {
          "function": "queryorderpool",
          "args": [
            driver.username, driver.password
          ]
        },
        "secureContext": "user_type1_0"
      },
      "id": 3
    }).then((res) => {
      console.log(res);
      // todo 如果取到订单不为空，存到this.state.orders中，司机选一个订单，点击抢单，触发另一个事件
      if (res.status == 200 && res.statusText == "OK" && res.data.result) {
        this.setState({orders: JSON.parse(res.data.result.message)});
      }

    }).catch((err) => {
      console.error(err);
      alert("Get order error!");
    })
  }

  selectOrder(from, to, id) {
    let isDone = confirm("Confirm Selection？");
    if (isDone) {
      // 发送接送订单请求
      axios.post(window.url + "/chaincode", {
        "jsonrpc": "2.0",
        "method": "invoke",
        "params": {
          "type": 1,
          "chaincodeID": {
            "name": window.chaincodeID
          },
          "ctorMsg": {
            "function": "compet",
            "args": [
              driver.username, driver.password, id+""
            ]
          },
          "secureContext": "user_type1_0"
        },
        "id": 3
      }).then((res) => {
          console.log(res);
        if (res.status == 200 && res.statusText == "OK" && res.data.result) {
            this.setState({isSelected: true});
            this.drawRoutes(from, to);
            // 司机已接单，停止轮询
            window.clearInterval(timer);
        }
      }).catch((err) => {
          alert("compet error!");
          console.error(err);
      })

    }
  }

  drawRoutes(from, to) {
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
  }

  pickUp() {

    // 去接乘客
    axios.post(window.url + "/chaincode", {
      "jsonrpc": "2.0",
      "method": "invoke",
      "params": {
        "type": 1,
        "chaincodeID": {
          "name": window.chaincodeID
        },
        "ctorMsg": {
          "function": "pickup",
          "args": [
            driver.username, driver.password, Date.parse(new Date())/1000 + ""
          ]
        },
        "secureContext": window.localStorage_nodeUser_value
      },
      "id": 3
    }).then((res) => {
      console.log("去接乘客...");
      console.log(res);
      if (res.status == 200 && res.statusText == "OK" && res.data.result) {
        console.log("success pickup");
        this.setState({message2: this.state.message2.concat(["Driver has picked up the passenger! Start traveling..."])});
        $("#start").trigger('click',() => {
          console.log("car move!");
        })
      }
    }).catch((err) => {
      alert("compet error!");
      console.error(err);
    })
  }

  finish() {

    // 结束行程
    axios.post(window.url + "/chaincode", {
      "jsonrpc": "2.0",
      "method": "invoke",
      "params": {
        "type": 1,
        "chaincodeID": {
          "name": window.chaincodeID
        },
        "ctorMsg": {
          "function": "finish",
          "args": [
            driver.username, driver.password, Date.parse(new Date())/1000 + ""
          ]
        },
        "secureContext": window.localStorage_nodeUser_value
      },
      "id": 3
    }).then((res) => {
      console.log("结束行程...");
      console.log(res);
      if (res.status == 200 && res.statusText == "OK" && res.data.result) {
        this.setState({message2: this.state.message2.concat(["Finish travel！"])})
        // // 司机轮询订单池
        // timer = setInterval(this.pollGetOrders, 1000);

        setTimeout(function(){
          // todo 司机余额、最近一次打车费用、里程
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
                  driver.username, driver.password
                ]
              },
              "secureContext": "user_type1_0"
            },
            "id": 3
          }).then((res2) => {
            if (res2.status == 200 && res2.statusText == "OK" && res2.data.result) {
              let balanceRes = JSON.parse(res2.data.result.message)
              alert("(Driver) Current balance: "+(balanceRes.balance/100)+"\nDistance: "+ balanceRes.distance+"公里\nDuration: "+balanceRes.duration/60+"分钟\nTotal fee: "+(balanceRes.actFeeDistance + balanceRes.actFeeDuration)/1000+"元")
            } else {
              alert("get balance error!");
              console.log(res2);
            }
          }).catch((err) => {
            console.error(err)
          })
        },1000);


      }
    }).catch((err) => {
      alert("compet error!");
      console.error(err);
    })
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
        <Left status="driver" selectOrder={this.selectOrder} pickUp={this.pickUp} finish={this.finish}
          isSelected={this.state.isSelected} orders={this.state.orders} message2={this.state.message2} onChange={val => this.setState({orders: val})}/>
        <GDMap/>
      </div>
    )
  }

}

Driver.defaultProps = {
};

export default Driver;
