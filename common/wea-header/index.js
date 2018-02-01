import React from 'react';
import { Row, Col ,Icon} from 'antd';
import './styles/wea-header.less';

export default class WeaHeader extends React.Component {
    render(){
        let iconType = this.props.icontype?this.props.icontype:"laptop"  
        return (
            <div className="common-header-box">
                <Row className="common-header-test">
                    <Col span={24} className="common-header-col">
                        <h1 className="common-header-title">
                            <Icon type={iconType} className="common-header-icon"/>
                            {this.props.title}
                        </h1>
                        <span  className="common-header-btn">{this.props.action}</span>
                    </Col>
                </Row>
            </div>
        )      
    }
}


