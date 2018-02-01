import React,{Component} from 'react';
import { Tooltip } from 'antd';
import './styles/weaTooltip.less'

export default class WeaTooltip extends Component{
  render() {
    const {width,height,title,...otherprops} = this.props;
    return (
        <Tooltip
          {...otherprops}
          overlayClassName='newtip'
          title={
            <div
              style={{width:width,height:height}}
            >
              {this.props.title}
            </div>
          }
        >
          {this.props.children}
        </Tooltip>
      )
  }
}