/**
 * Created by sammy on 17/3/11.
 */

require('styles/Left.sass');

import React from 'react';
import $ from 'jquery';
import List from './List'

var orders = [];
var driverFlag = true;

class Left extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmit: false,
      orders: [],
      isSelected: false,
      message: [],
      message2: [],
    }

    // 乘客确认打车
    this.handleConfirm = this.handleConfirm.bind(this);
    this.startDrive = this.startDrive.bind(this);
    // 司机选择订单
    this.handleSelectOrder = this.handleSelectOrder.bind(this);
    // 司机去接乘客
    this.handlePickUp = this.handlePickUp.bind(this);
    // 司机结束行程
    this.handleFinish = this.handleFinish.bind(this);
  }

  static defaultProps = {
    isSubmit: false,
    orders: [],
    onChange: new Function,
    isSelected: false,
  };

  static PropTypes = {
    isSubmit: React.PropTypes.bool,
    orders: React.PropTypes.array,
    onChange: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      isSubmit: nextProps.isSubmit,
      orders: nextProps.orders,
      isSelected: nextProps.isSelected,
      message: nextProps.message,
      message2: nextProps.message2,
    });
  }

  componentDidMount() {
    var from = new AMap.Autocomplete({
      input: "from"
    });
    var to = new AMap.Autocomplete({
      input: "to"
    });

    // if (this.props.orders) {
    //   orders = this.props.orders;
    // }

    $("#orderListWrap").on("click", '.orderWrap', (e) => {
      console.log("click #orderListWrap");
      var currentTargetDOM = e.currentTarget;
      this.handleSelectOrder($(currentTargetDOM.children[0]).html(), $(currentTargetDOM.children[1]).html(), $(e.currentTarget.children[2]).html());
    })

  }

  // 乘客确认打车
  handleConfirm(e) {
    var from = document.querySelector("#from").value;
    var to = document.querySelector("#to").value;
    console.log(from, to);
    this.props.confirmOrder(from, to);
  }

  startDrive(e) {

  }

  // 司机选择订单
  handleSelectOrder(from, to, orderId) {
    console.log("司机选择 "+orderId+" 订单");
    this.props.selectOrder(from, to ,orderId);
  }

  // 司机去接乘客
  handlePickUp() {
    this.props.pickUp();
  }

 // 司机结束行程
  handleFinish() {
    this.props.finish();
  }

  render() {

    // 渲染order
    let orderList = [];
    if (this.state.orders) {
      for (let i = 0; i < this.state.orders.length; i++) {
        let order = <div className="orderWrap">
          <div>{this.state.orders[i].sname}</div>
          <div>{this.state.orders[i].dname}</div>
          <div style={{display: 'none'}}>{this.state.orders[i].id}</div>
        </div>
        orderList.push(order);
      }
    }


    return (
      <div className="leftPanel">
        <div style={{display: this.props.status == "passenger" && this.state.isSubmit == false ? 'block' : 'none'}}>
          <div className="placeWrap">
            <input type="text" id="from" name="from"/>
            <input type="text" id="to" name="to"/>
          </div>
          <div className="buttonGroup">
            <div className="button" onClick={this.handleConfirm}>Confirm a taxi</div>
            <div className="button" id="start" style={{visibility: 'hidden'}}>测试行驶路线</div>
          </div>
        </div>
        <div className="loader" style={{display: this.props.status == "passenger" && this.state.isSubmit == true ? 'block' : 'none'}}>
          <p className="text-center" style={{fontSize: '2em', fontWeight: '200'}}>Passenger status</p>
          <List datas={this.state.message}/>
        </div>
        <div id="orderListWrap" style={{display: this.props.status == "driver" ? 'block' : 'none'}}>
          {this.state.orders && this.state.orders.length == 0 ?
            <p className="text-center">No available orders！</p> :
          this.state.isSelected == true ?
            <div className="buttonGroup">
              <div className="button" onClick={this.handlePickUp}>Pick up</div>
              <div className="button" onClick={this.handleFinish}>Finish</div>
            </div> :
            <div className="orderListWrap">
              <p className="text-center" style={{fontSize: '2em', fontWeight: '200'}}>Available orders</p>
              {orderList}
            </div>
          }
          <div style={{display: this.state.isSelected == true ? 'block' : 'none'}}>
            <p className="text-center" style={{fontSize: '2em', fontWeight: '200'}}>Driver status</p>
            <ul>
              <li>Preparing to pick up the passenger...</li>
            </ul>
            <List datas={this.state.message2}/>
          </div>

        </div>
      </div>
    )
  }
}

Left.defaultProps = {
};

export default Left;
