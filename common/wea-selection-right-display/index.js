import React from 'react';
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
// 导入antd组件
import {Icon} from 'antd';
import MediaUtil from '../../../utils/media';

/**
 * 选择权限展示组件
 *
 * @author chenlongtao
 */
@observer
class WeaSelectionRightDisplay extends React.Component {
  /**
   * 组件加载完成
   */
  componentDidMount() {

  }

  /**
   * 刷新组件
   * @returns {XML}
   */
  render() {
    // 获取选中节点
    const selectedNodes = toJS(this.props.selectedNodes);
    // 选择Label的click事件处理函数
    const onSelectLabelClick = toJS(this.props.onSelectLabelClick);

    return (
      <div>
        {
          this.props.selectLabelDisabled ?
            "" :
            (<div>
              <a onClick={onSelectLabelClick}>
                {this.props.selectLabel ? this.props.selectLabel : "设置权限"}
              </a>
            </div>)
        }
        {
          this.props.type == "hrm" && selectedNodes.managedepartlist && selectedNodes.managedepartlist.length > 0 ?
            <div>
              <div>具有管理权限</div>
              <div style={{display: "inline-block"}}>
                {
                  selectedNodes.managedepartlist.map(dept => {
                    return (
                      <span
                        key={dept.id}
                        style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                      >
                  <Icon
                    type="folder"
                    style={{fontSize: 13}}
                  />
                        {dept.name}
                        {
                          this.props.deleteIconDisabled ?
                            "" :
                            (
                              <Icon
                                type="close"
                                style={{
                                  fontSize: 13,
                                  cursor: "pointer",
                                  marginLeft: 5
                                }}
                                onClick={this.onDeleteIconClick.bind(this, "MANAGE_DEPT", dept.id)}
                              />
                            )
                        }

                </span>
                    );
                  })
                }
              </div>
            </div> : ""
        }
        {
          this.props.type == "hrm" && selectedNodes.viewdepartlist && selectedNodes.viewdepartlist.length > 0 ?
            <div>
              <div>具有查看权限</div>
              <div style={{display: "inline-block"}}>
                {
                  selectedNodes.viewdepartlist.map(dept => {
                    return (
                      <span
                        key={dept.id}
                        style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                      >
                  <Icon
                    type="folder"
                    style={{fontSize: 13}}
                  />
                        {dept.name}
                        {
                          this.props.deleteIconDisabled ?
                            "" :
                            (
                              <Icon
                                type="close"
                                style={{
                                  fontSize: 13,
                                  cursor: "pointer",
                                  marginLeft: 5
                                }}
                                onClick={this.onDeleteIconClick.bind(this, "VIEW_DEPT", dept.id)}
                              />
                            )
                        }
                </span>
                    );
                  })
                }
              </div>
            </div> : ""
        }
        {
          this.props.type == "agent" && selectedNodes.manageagentlist && selectedNodes.manageagentlist.length > 0 ?
            <div>
              <div>具有管理权限</div>
              <div style={{display: "inline-block"}}>
                {
                  selectedNodes.manageagentlist.map(agent => {
                    return (
                      <span
                        key={agent.open_id}
                        style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                      >
                        <img width={29} height={29} alt="" src={MediaUtil.getMediaUrl(agent.media_id)}
                             style={{marginBottom: 5, marginRight: 5, marginLeft: -5}}/>
                        {agent.name}
                        {
                          this.props.deleteIconDisabled ?
                            "" :
                            (
                              <Icon
                                type="close"
                                style={{
                                  fontSize: 13,
                                  cursor: "pointer",
                                  marginLeft: 5
                                }}
                                onClick={this.onDeleteIconClick.bind(this, "MANAGE_AGENT", agent.open_id)}
                              />
                            )
                        }
                      </span>
                    );
                  })
                }
              </div>
            </div> : ""
        }
      </div>
    );
  }

  /**
   * 删除图标点击事件
   * @param type 删除的类型
   * @param id 删除的id
   */
  onDeleteIconClick = (type, id) => {
    this.props.onDeleteIconClick(type, id, this.props.deleteIndex);
  }
}

// 导出默认
export default WeaSelectionRightDisplay;