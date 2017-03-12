/**
 * Created by sammy on 17/3/11.
 */

require('styles/GDMap.sass');

import React from 'react';

class GDMap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    var map = new AMap.Map("myMap", {
      resizeEnable: true,
      // center: [116.397428, 39.90923],
      zoom: 20
    });

    var marker = new AMap.Marker({
      position: [121.4966941226,31.2278066005]
    });

    marker.setMap(map);
    map.setFitView();

    //-------------------------

    {/*var departure= "北京市地震局(公交站)", destination="亦庄文化园(地铁站)", departureCode;*/}
    {/*var marker, lineArr = [];*/}
    {/*var geocoder;*/}

    {/*var map = new AMap.Map("myMap", {*/}
      {/*resizeEnable: true,*/}
      {/*// center: [116.397428, 39.90923],*/}
      {/*zoom: 20*/}
    {/*});*/}
    {/*console.log(map);*/}

    {/*var geocoder = new AMap.Geocoder({*/}
      {/*city: "010", //ÂüéÂ∏ÇÔºåÈªòËÆ§Ôºö‚ÄúÂÖ®ÂõΩ‚Äù*/}
      {/*radius: 1000 //ËåÉÂõ¥ÔºåÈªòËÆ§Ôºö500*/}
    {/*});*/}

    {/*var drivingOption = {*/}
      {/*policy: AMap.DrivingPolicy.LEAST_TIME*/}
    {/*};*/}
    {/*var driving = new AMap.Driving(drivingOption);*/}

    {/*// get geocode*/}
    {/*geocoder.getLocation(departure, function (status, result) {*/}
      {/*if (status === 'complete' && result.info === 'OK') {*/}
        {/*console.log(marker);*/}
        {/*console.log(marker.G.position)*/}
        {/*console.log("get location OK")*/}
        {/*console.log(result)*/}
        {/*departureCode=new AMap.LngLat(result.geocodes[0].location.getLng(), result.geocodes[0].location.getLat())*/}
        {/*//console.log(departureCode)*/}
        {/*marker.setPosition(departureCode)*/}

        {/*console.log(departureCode)*/}
      {/*} else {*/}
        {/*alert(result.info)*/}
      {/*}*/}
    {/*});*/}

    {/*marker = new AMap.Marker({*/}
      {/*map: map,*/}
      {/*// position: new AMap.LngLat(result.geocodes[0].location.getLng(), result.geocodes[0].location.getLat()),*/}
      {/*icon: "http://webapi.amap.com/images/car.png",*/}
      {/*offset: new AMap.Pixel(-26, -13),*/}
      {/*autoRotation: true*/}
    {/*});*/}



    {/*driving.search([{*/}
      {/*keyword: departure*/}
    {/*}, {*/}
      {/*keyword: destination*/}
    {/*}], function (status, result) {*/}
      {/*if (status === 'complete' && result.info === 'OK') {*/}
        {/*(new Lib.AMap.DrivingRender()).autoRender({*/}
          {/*data: result,*/}
          {/*map: map,*/}
          {/*// panel: "panel"*/}
        {/*});*/}
        {/*var paths = [];*/}

        {/*for (var i = 0; i < result.routes[0].steps.length; i++) {*/}
          {/*paths = paths.concat(result.routes[0].steps[i].path);*/}
        {/*}*/}
        {/*lineArr = paths;*/}
      {/*} else {*/}
        {/*alert(result);*/}
      {/*}*/}
    {/*});*/}


    {/*// 绘制轨迹*/}
    {/*var polyline = new AMap.Polyline({*/}
      {/*map: map,*/}
      {/*path: lineArr,*/}
      {/*strokeColor: "#00A", //线颜色*/}
      {/*// strokeOpacity: 1,     //线透明度*/}
      {/*strokeWeight: 3, //线宽*/}
      {/*// strokeStyle: "solid"  //线样式*/}
    {/*});*/}

    {/*marker.on('moving', function (e) {*/}
      {/*polyline.setPath(e.passedPath);*/}
    {/*})*/}
    {/*map.setFitView();*/}

    {/*AMap.event.addDomListener(document.getElementById('start'), 'click', function () {*/}
  //     marker.moveAlong(lineArr, 5000);
  //   }, false);
  //   AMap.event.addDomListener(document.getElementById('pause'), 'click', function () {
  //     marker.pauseMove();
  //   }, false);
  //   AMap.event.addDomListener(document.getElementById('resume'), 'click', function () {
  //     marker.resumeMove();
  //   }, false);
  //   AMap.event.addDomListener(document.getElementById('stop'), 'click', function () {
  //     marker.stopMove();
  //   }, false);
  }

  render() {
    return (
      <div className="rightMap">
        {/*<div className="button-group" style={{position:'relative'}}>*/}
          {/*<input type="button" className="button" style={{position:'absolute',top:'50px',left:'300px'}} value="开始动画" id="start" />*/}
          {/*<input type="button" className="button" value="暂停动画" id="pause" />*/}
          {/*<input type="button" className="button" value="继续动画" id="resume" />*/}
          {/*<input type="button" className="button" value="停止动画" id="stop" />*/}
        {/*</div>*/}
        {/*<div id="container" style={{position: 'static'}}></div>*/}
        <div id="myMap"></div>
        <div id="panel"></div>
      </div>
    )
  }

}

GDMap.defaultProps = {
};

export default GDMap;
