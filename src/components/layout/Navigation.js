/**
 * Created by sammy on 17/1/1.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';

var smoothScroll = {
  timer: null,

  stop: function () {
    clearTimeout(this.timer);
  },

  scrollTo: function (id, callback) {
    var settings = {
      duration: 1000,
      easing: {
        outQuint: function (x, t, b, c, d) {
          return c*((t=t/d-1)*t*t*t*t + 1) + b;
        }
      }
    };
    var percentage;
    var startTime;
    var node = document.getElementById(id);
    var nodeTop = node.offsetTop;
    var nodeHeight = node.offsetHeight;
    var body = document.body;
    var html = document.documentElement;
    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    var windowHeight = window.innerHeight
    var offset = window.pageYOffset;
    var delta = nodeTop - offset;
    var bottomScrollableY = height - windowHeight;
    var targetY = (bottomScrollableY < delta) ?
    bottomScrollableY - (height - nodeTop - nodeHeight + offset):
      delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step () {
      var yScroll;
      var elapsed = Date.now() - startTime;

      if (elapsed > settings.duration) {
        clearTimeout(this.timer);
      }

      percentage = elapsed / settings.duration;

      if (percentage > 1) {
        clearTimeout(this.timer);

        if (callback) {
          callback();
        }
      } else {
        yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
        window.scrollTo(0, yScroll);
        this.timer = setTimeout(step, 10);
      }
    }

    this.timer = setTimeout(step, 10);
  }
};

class Navigation extends React.Component {

  constructor(props){
    super(props);

    this.state = {
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){

  }

  handleClick(refName, item) {
    var navItemDOM = ReactDOM.findDOMNode(this.refs[refName]);
    navItemDOM.parentNode.childNodes.forEach((node) => {
      node.style.borderBottom = 'none'
    });

    navItemDOM.style.borderBottom = '1px solid #ffffff';
    smoothScroll.scrollTo(item)
  }

  render() {

    let datas = this.props.datas;

    let navItemStyle = {
      margin: '0 40px',
      borderBottom: this.state.borderBottom,
    };

    let NavItems = datas.nav.map((item, index) => {
        let hrefURL = '#'+item;
        return <NavItem eventKey={index+1} href={hrefURL} style={navItemStyle}
                        onClick={this.handleClick.bind(this, 'nav' + index,item)} key={'nav' + index} ref={'nav' + index}>{item}</NavItem>
    });

    return (
      <Navbar>
        <Navbar.Header>
          <a href="#" className="navbar-brand" style={{padding: '0 5px 0 15px', display: 'table'}}>
            <span style={{display: 'table-cell', verticalAlign: 'middle'}}>
              <img className="img-responsive" src={datas.logo.imgURL}/>
            </span>
          </a>
          <Navbar.Brand>
            <a href="#">{datas.title}</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {/*<Navbar.Collapse>*/}
          {/*<Nav pullRight>*/}
            {/*{NavItems}*/}
          {/*</Nav>*/}
        {/*</Navbar.Collapse>*/}
      </Navbar>
    )
  }
}

export default Navigation;
