import React, { Component } from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import Request from './utils/server';

export default class Demension extends Component {

  constructor(props){
    super(props);
    this.Request = new Request();
    this.state = {
      activeDemision: {
        orgid: '1',
        orgName: props.dimension.filter(item => item.id == '1')[0].name
      },
    };
  }

  render(){
    const { dimension } = this.props;
    const { activeDemision } = this.state;
    console.log('orgDimension',dimension);

    const menu = (
      <Menu
        className="demension-dropdown"
        onClick={this.changeDimension}
      >
        {dimension.length > 0 && dimension.map(org => {
          return (
            <Menu.Item
              key={org.id}
              className={activeDemision.orgid == org.id ? 'dimension-menu-item' : ''}
            >
              {org.name}
            </Menu.Item>
          )
        })}
      </Menu>
    );

    return (
      <Dropdown
        overlay={menu}
        className="demension-dropdown"
        placement="bottomLeft"
        trigger={['click']}
      >
        <div>
          {activeDemision.orgName} <Icon type="down" />
        </div >
      </Dropdown>
    )
  }

  changeDimension = (val) => {
    if (val.key != this.state.activeDemision.orgid) {
      this.setState({
        activeDemision: {
          orgid: val.key,
          orgName: val.item.props.children
        }
      });
    }
    console.log('---select org----',val);
  };
}