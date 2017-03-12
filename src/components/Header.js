/**
 * Created by sammy on 16/12/31.
 */
require('styles/Header.sass');

import React from 'react';
import ReactDOM from 'react-dom'
import {FormGroup, FormControl, Radio} from 'react-bootstrap'
import { browserHistory } from 'react-router'
import axios from 'axios'
import sha1 from 'sha1'
import Navigation from './layout/Navigation';

let node;

class Header extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        isLogin: true,
        isDisableRegit: false,
        isDisableLogin: false,
      }

      this.handleLogin = this.handleLogin.bind(this);
      this.handleGoRegister = this.handleGoRegister.bind(this);
      this.handleRegister = this.handleRegister.bind(this);
      this.handleGoLogin = this.handleGoLogin.bind(this);
    }

    componentDidMount() {
      // node = localStorage.getItem(window.localStorage_nodeUser_key);
    }

    handleLogin(event) {
      event.preventDefault();

      if (this.state.isDisableLogin) {
        return false;
      }

      this.setState({isDisableLogin : true});

      var username = ReactDOM.findDOMNode(this.refs.username).value;
      var password = ReactDOM.findDOMNode(this.refs.password).value;

      if (!username || !password) {
        alert("字段不能为空");
        this.setState({isDisableLogin : false});
        return;
      }

      password = sha1(password);

      var params = [];
      params.push(username, password);

      //  调用chaincode登录， 若成功，将用户名存到localstorage里面
      axios.post(window.url + "/chaincode", {
        "jsonrpc": "2.0",
        "method": "query",
        "params": {
          "type": 1,
          "chaincodeID": {
            "name": window.chaincodeID
          },
          "ctorMsg": {
            "function": "isEnroll",
            "args": params
          },
          "secureContext": window.localStorage_nodeUser_value
        },
        "id": 3
      }).then((res) => {

        if (res.status == 200 && res.statusText === "OK" && res.data.result) {

          let msg = res.data.result.message;

          if (msg == "0") {
            alert("用户不存在！");
            this.setState({isDisableLogin : false});
          } else if (msg == "1") {
            // 若是司机，跳转到司机界面
            localStorage.setItem(window.localStorage_driver_key, JSON.stringify({"username": username, "password": password}));
            this.setState({isDisableLogin : false});
            browserHistory.push("/driver");
          } else if (msg == "2") {
            // 若是乘客，跳转到乘客界面
            localStorage.setItem(window.localStorage_pass_key, JSON.stringify({"username": username, "password": password}));
            this.setState({isDisableLogin : false});
            browserHistory.push("/passenger");
          } else {
            alert("未知错误信息");
            this.setState({isDisableLogin : false});
          }
        } else {
          alert(res.data.error);
          console.log(res);
          this.setState({isDisableLogin : false});
        }
      }).catch((err) => {
        alert("Login error!");
        console.log(err);
        this.setState({isDisableLogin : false});
      });
    }

    handleGoRegister(event) {
      event.preventDefault();
      this.setState({
        isLogin: false,
      });

    }

    handleRegister(event) {
      event.preventDefault();

      if (this.state.isDisableRegit) {
        return false;
      }

      this.setState({isDisableRegit : true});

      var username = document.querySelector('#registerPanel input[name="username"]').value;
      var password = document.querySelector('#registerPanel input[name="password"]').value;
      var name = document.querySelector('#registerPanel input[name="name"]').value;
      var telephone = document.querySelector('#registerPanel input[name="telephone"]').value;
      var number = document.querySelector('#registerPanel input[name="number"]').value;
      var selectDOM = document.querySelector('#identity');
      var identity = selectDOM.options[selectDOM.selectedIndex].value;


      if (!username || !password || !name || !telephone || !number) {
        alert("字段不能为空！");
        this.setState({isDisableRegit : false});
      } else if (/^[\d]*$/.test(username)) {
        alert("用户名不能为纯数字!");
        this.setState({isDisableRegit : false});
      }else if (identity == -1) {
        alert("请选择要注册的身份");
        this.setState({isDisableRegit : false});
      } else {
        password = sha1(password);

        var params = [];

        params.push(username, password, name+" " + telephone + " " + number, identity);

        console.log(params);

        // 调用chaincode注册
        axios.post(window.url + "/chaincode", {
          "jsonrpc": "2.0",
          "method": "invoke",
          "params": {
            "type": 1,
            "chaincodeID": {
              "name": window.chaincodeID
            },
            "ctorMsg": {
              "function": "enroll",
              "args": params
            },
            "secureContext": window.localStorage_nodeUser_value
          },
          "id": 3
        }).then((res) => {
          // 若成功，跳转到登录页面
          if (res.status == 200 && res.statusText === "OK" && res.data.result) {
            this.setState({
              isLogin: true,
              isDisableRegit : false,
            });
          } else {
            alert("Register error!");
            console.log(res);
            this.setState({
              isDisableRegit : false,
            });
          }

        }).catch((err) => {
          alert("Error!");
          console.log(err);
          this.setState({
            isDisableRegit : false,
          });
        });
      }


    }

    handleGoLogin(event) {
      event.preventDefault();
      this.setState({
        isLogin: true,
      });
    }

    render() {

      let bannerImgURL = this.props.headerData.backgroundImgURL,
          title        = this.props.headerData.title,
          subTitle     = this.props.headerData.subTitle;

      let winHeight;

      //获取窗口高度
      if (window.innerHeight)
        winHeight = window.innerHeight;
      else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;

      let stylObj = {
        background: 'url("'+ bannerImgURL +'") no-repeat 50% 90%',
        backgroundSize: 'cover',
        height: winHeight,
      };

      return (
        // {/*<div className="jumbotron top_nav" style={stylObj}>*/}
        <div className="top_nav" style={stylObj}>
          <Navigation datas={this.props.headerData}/>
          <div className="container">
            <form style={{margin: '30px auto', width: '30%'}}>
              <FormGroup>
                <div className="text-center">
                  <h1>{title}</h1>
                  <h2>{subTitle}</h2>
                </div>
              </FormGroup>
              <div id="loginPanel" style={{display: this.state.isLogin ? 'block' : 'none'}}>
                <FormGroup bsSize="">
                  <FormControl type="text" placeholder="Username" ref="username"/>
                </FormGroup>
                <FormGroup bsSize="">
                  <FormControl type="password" placeholder="Password" ref="password" />
                </FormGroup>
              </div>
              <div id="registerPanel" style={{display: this.state.isLogin ? 'none' : 'block'}}>
                <FormGroup bsSize="">
                  <FormControl type="text" name="username" placeholder="Username" />
                </FormGroup>
                <FormGroup bsSize="">
                  <FormControl type="password" name="password" placeholder="Password" />
                </FormGroup>
                <FormGroup bsSize="">
                  <FormControl type="text" name="name" placeholder="your name" />
                </FormGroup>
                <FormGroup bsSize="">
                  <FormControl type="text" name="telephone" placeholder="your telephone" />
                </FormGroup>
                <FormGroup bsSize="">
                  <FormControl type="text" name="number" placeholder="your license plate number" />
                </FormGroup>
                <FormGroup controlId="formControlsSelect">
                  {/*<ControlLabel>Select</ControlLabel>*/}
                  <FormControl componentClass="select" id="identity" placeholder="your identity">
                    <option value="-1">==== select your identity ====</option>
                    <option value="2">乘客</option>
                    <option value="1">司机</option>
                  </FormControl>
                </FormGroup>
              </div>
              <div className="buttonGroup" style={{display: this.state.isLogin ? 'block' : 'none'}}>
                  <div className="button" onClick={this.handleLogin} disabled={this.state.isDisableLogin}>Login</div>
                  {/*<div className="button" onClick={this.handleRegister}>注册</div>*/}
                  <div className="button" onClick={this.handleGoRegister}>Go to register > </div>
              </div>
              <div className="buttonGroup" style={{display: this.state.isLogin ? 'none' : 'block'}}>
                <div className="button" onClick={this.handleRegister} disabled={this.state.isDisableRegit}>Register</div>
                {/*<div className="button" onClick={this.handleRegister}>注册</div>*/}
                <div className="button" onClick={this.handleGoLogin}>Go to Login > </div>
              </div>
            </form>
          </div>
        </div>
      )
    }
}

export default Header;
