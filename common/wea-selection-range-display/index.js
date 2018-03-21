import React from 'react';
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
// 导入antd组件
import {Icon, Button} from 'antd';

/**
 * 选择范围展示组件
 *
 * @author chenlongtao
 */
@observer
class WeaSelectionRangeDisplay extends React.Component {
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
      <div style={{display: "inline-block"}}>
        {
          this.props.selectLabelDisabled ?
            "" :
            (<div>
              <a onClick={onSelectLabelClick}>
                {this.props.selectLabel ? this.props.selectLabel : "选择部门 / 成员 / 标签"}
              </a>
            </div>)
        }
        {
          ((selectedNodes.mydept && (selectedNodes.mydept == 5 || selectedNodes.mydept == 6)) ||
            (selectedNodes.deptlist && selectedNodes.deptlist.length > 0) ||
            (selectedNodes.partylist && selectedNodes.partylist.length > 0) ||
            (selectedNodes.userlist && selectedNodes.userlist.length > 0) ||
            (selectedNodes.taglist && selectedNodes.taglist.length > 0)) ?
            <div style={{display: "inline-block"}}>
              {
                selectedNodes.mydept && (selectedNodes.mydept == 5) ? (
                  <span
                    style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                  >
                <Icon
                  type="folder-open"
                  style={{fontSize: 13}}
                />
                本部门
              </span>
                ) : (
                  (selectedNodes.mydept == 6) ? (
                    <span
                      style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                    >
                <Icon
                  type="folder"
                  style={{fontSize: 13}}
                />
                本部门
                </span>
                  ) : ("")
                )
              }
              {
                selectedNodes.deptlist && selectedNodes.deptlist.map(dept => {
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
                              onClick={this.onDeleteIconClick.bind(this, "DEPT", dept.id)}
                            />
                          )
                      }

                </span>
                  );
                })
              }
              {
                selectedNodes.partylist && selectedNodes.partylist.map(party => {
                  return (
                    <span
                      key={party.id}
                      style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                    >
                  <Icon
                    type="folder-open"
                    style={{fontSize: 13}}
                  />
                      {party.name}
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
                              onClick={this.onDeleteIconClick.bind(this, "PARTY", party.id)}
                            />
                          )
                      }

                </span>
                  );
                })
              }
              {
                selectedNodes.userlist && selectedNodes.userlist.map(user => {
                  return (
                    <span
                      key={user.id}
                      style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                    >
                  <Icon
                    type="user"
                    style={{fontSize: 13}}
                  />
                      {user.name}
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
                              onClick={this.onDeleteIconClick.bind(this, "USER", user.id)}
                            />
                          )
                      }
                </span>
                  );
                })
              }
              {
                selectedNodes.taglist && selectedNodes.taglist.map(tag => {
                  return (
                    <span
                      key={tag.id}
                      style={{border: "1px solid #999999", padding: "5px 5px", marginRight: "10px"}}
                    >
                  <Icon
                    type="tag-o"
                    style={{fontSize: 13}}
                  />
                      {tag.name}
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
                              onClick={this.onDeleteIconClick.bind(this, "TAG", tag.id)}
                            />
                          )
                      }
                </span>
                  );
                })
              }
            </div> : "暂无数据"
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
export default WeaSelectionRangeDisplay;