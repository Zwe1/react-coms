import React from 'react';
import {
  Tooltip,
} from 'antd';

export default class TableCell extends React.Component {
  render(){
    const {
      module,
      type,
      record
    } = this.props;
    if (module === 'logaccess' || module === 'logsearch') {
      switch (type) {

        case 'deptlist':
          if (record[type] && record[type].length > 1) {
            return (
              <div>
                {
                  record[type].map((item,index) => {
                    return (
                      <li key={index}>
                        <Tooltip
                          placement="top"
                          title={item.path}
                          arrowPointAtCenter
                        >
                          {item.name}
                        </Tooltip>
                      </li>
                    )
                  })
                }
              </div>
            )
          } else if (record[type]) {
            return (
              <Tooltip
                placement="top"
                title={record[type][0].path}
                arrowPointAtCenter
              >
                {record[type][0].name}
              </Tooltip>
            )
          } else {
            return (<div>无数据</div>)
          }
          break;


        case 'other':
          return (
            <ul>
              {record.device_id && <li>硬件标识：{record.device_id}</li>}
              {record.lang_type && <li>语言类型：{record.lang_type}</li>}
              {record.os_version && <li>操作系统版本：{record.os_version}</li>}
              {record.client_model && <li>设备型号：{record.client_model}</li>}
            </ul>
          );
          break;

        default:
          return (
            <span>{record[type]}</span>
          );

          break;
      }

    }
  }
}