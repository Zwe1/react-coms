import React from 'react';
import PropTypes from 'prop-types';
import './styles/weapermission.less';
import HttpUtil from '../../../utils/http';
import MediaUtil from '../../../utils/media';
import {inject, observer} from 'mobx-react';
import {Scrollbars} from 'react-custom-scrollbars';
import {Modal, List, Checkbox, Tree, Icon, message} from 'antd';

const TreeNode = Tree.TreeNode;

@inject('hrmStore')
@observer
export default class WeaPermission extends React.Component {
  static defaultProps = {
    title: '设置权限',
    leftTool: '查看',
    rightTool: '管理',
    type: 'agent',
    maskClosable: true,
    zIndex: 1000,
    onlyOneSelect: false,
    clientType: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],//应用列表
      portalData: [],//门户列表数据
      treeDate: {},//树数据
      agid: [],//应用选中按钮
      portal_id: [],//门户选中按钮
      viewid: [],//view选择按钮
      manid: [],//manage选择按钮
      deptNameId: [],//id和部门名称映射
      manageagentlist: [],//应用选择返回数据
      portallist: [],//门户选择返回数据
      manageorglist: {
        'managedepartlist': [],
        'viewdepartlist': []
      },//树选择返回数据
    };
  }

  componentWillReceiveProps(props) {
    if (!props.visible) {
      this.setState({
        manid: [],
        viewid: [],
        agid: [],
        portal_id: [],
        manageagentlist: [],
        portallist: [],
        manageorglist: {
          'managedepartlist': [],
          'viewdepartlist': []
        }
      })
    } else {
      if (props.defaultSelected) {
        if (props.type === 'hrm') {
          const selected = Object.assign({'managedepartlist': [],'viewdepartlist': []},props.defaultSelected);
          if (selected.managedepartlist &&
            selected.viewdepartlist &&
            selected.managedepartlist instanceof Array &&
            selected.viewdepartlist instanceof Array) {
            const {viewid, manid} = this.state;
            selected.managedepartlist.forEach(item => {
              manid.push(item.id)
            });
            selected.viewdepartlist.forEach(item => {
              viewid.push(item.id)
            });
            this.setState({
              viewid: viewid,
              manid: manid
            })
          } else {
            message.warning('默认选择数据格式不正确！');
          }
        } else if (props.type === 'agent') {
          const selected = props.defaultSelected.manageagentlist && props.defaultSelected.manageagentlist.concat([]) || [];
          let arr = [];
          selected.forEach(item => {
            arr.push(item.id);
          });
          this.setState({
            manageagentlist: selected,
            agid: arr
          })
        } else if (props.type === 'portal') {
          const selected = props.defaultSelected.portallist && props.defaultSelected.portallist.concat([]) || [];
          let arr = [];
          selected.forEach(item => {
            arr.push(item.id);
          });
          this.setState({
            portallist: selected,
            portal_id: arr
          })
        }
      }
      if (props.type === 'agent') {
        this.getAgentList();
      } else if (props.type === 'hrm') {
        this.getOrgList();
      } else if (props.type === 'portal') {
        this.getPortalList();
      }
    }
  }

  componentDidMount() {
    const {type} = this.props;
    if (type === 'agent') {
      this.getAgentList();
    } else if (type === 'hrm') {
      this.getOrgList();
    } else if (type === 'portal') {
      this.getPortalList();
    }
  }

  onOk = () => {
    const {manageagentlist, manageorglist, portallist} = this.state;
    const {onSubmit} = this.props;
    if (this.props.type === 'agent') {
      onSubmit({'manageagentlist': manageagentlist})
    }
    if (this.props.type === 'portal') {
      onSubmit({'portallist': portallist})
    }
    if (this.props.type === 'hrm') {
      const {viewid, manid, deptNameId} = this.state;
      viewid.forEach(item => {
        manageorglist.viewdepartlist.push({
          'id': item,
          'name': deptNameId[item]
        })
      });
      manid.forEach(item => {
        manageorglist.managedepartlist.push({
          'id': item,
          'name': deptNameId[item]
        })
      });
      onSubmit(manageorglist)
    }
  };

  onCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };

  render() {

    const {
      title,
      type,
      visible,
      maskClosable,
      zIndex,
      leftTool,
      rightTool
    } = this.props;

    const {
      data,
      portalData,
      treeDate
    } = this.state;
    return (
      <Modal
        className="wea-permission"
        title={title}
        visible={visible}
        zIndex={zIndex}
        maskClosable={maskClosable}
        onOk={this.onOk}
        onCancel={this.onCancel}
        okText="确定"
        cancelText="取消"
      >
        <header className="hrm-header">
          {type === 'hrm' && <span>{leftTool}</span>}
          <span>{rightTool}</span>
        </header>
        <Scrollbars
          autoHide
          style={{
            height: 400,
            zIndex: 10
          }}
        >
          {type === 'agent' &&
          <List
            size="small"
            className="permission-list"
            bordered
            dataSource={data}
            renderItem={this.renderAgent}
          />
          }
          {type === 'portal' &&
          <List
            size="small"
            className="permission-list"
            bordered
            dataSource={portalData}
            renderItem={this.renderPortal}
          />
          }
          {type === 'hrm' &&
          <Tree
            className="permission-tree"
          >
            {this.treeRnder(treeDate)}
          </Tree>
          }
        </Scrollbars>
      </Modal>
    )
  }

  //check选项变化
  check = (data, e) => {
    const checked = e.target.checked;
    const target = e.target.name;
    let {manageagentlist, viewid, manid, agid, portal_id, portallist} = this.state;
    if (this.props.type === 'agent') {
      const match = {
        'open_id': data.agentid,
        'id': data.id,
        'name': data.name,
        'media_id': data.logo.media_id
      };
      if (checked) {
        if (this.props.onlyOneSelect) {
          agid = [data.id];
          manageagentlist = [match];
        } else {
          agid.indexOf(data.id) === -1 && agid.push(data.id);
          manageagentlist.indexOf(match) === -1 && manageagentlist.push(match);
        }
      } else {
        agid.splice(agid.indexOf(data.id), 1);
        manageagentlist.splice(
          manageagentlist.indexOf(
            manageagentlist.filter(item => item.id === data.id)[0])
          , 1);
      }
      this.setState({
        manageagentlist: manageagentlist,
        agid: agid
      })
    } else if (this.props.type === 'portal') {
      const match = {
        'portal_id': data.portal_id,
        'name': data.portal_name
      };
      if (checked) {
        if (this.props.onlyOneSelect) {
          portal_id = [data.portal_id];
          portallist = [match];
        } else {
          portal_id.indexOf(data.portal_id) === -1 && portal_id.push(data.portal_id);
          portallist.indexOf(match) === -1 && portallist.push(match);
        }
      } else {
        portal_id.splice(portal_id.indexOf(data.portal_id), 1);
        portallist.splice(
          portallist.indexOf(
            portallist.filter(item => item.portal_id === data.portal_id)[0])
          , 1);
      }
      this.setState({
        portallist: portallist,
        portal_id: portal_id
      })
    } else if (this.props.type === 'hrm') {
      if (checked) {
        if (target === 'view') {
          viewid.indexOf(data.id) === -1 && viewid.push(data.id);
          this.setState({
            viewid: viewid
          });
        } else if (target === 'manage') {
          viewid.indexOf(data.id) > -1 && viewid.splice(viewid.indexOf(data.id), 1);
          manid.indexOf(data.id) === -1 && manid.push(data.id);
          this.setState({
            viewid: viewid,
            manid: manid
          });
        }
      } else {
        if (target === 'view') {
          viewid.splice(viewid.indexOf(data.id), 1);
          this.setState({
            viewid: viewid
          });
        } else if (target === 'manage') {
          manid.splice(manid.indexOf(data.id), 1);
          this.setState({
            manid: manid
          });
        }
      }
    }
  };


  /**
   * 获取应用列表
   */
  getAgentList = () => {
    const { clientType } = this.props;
    const uri = clientType === 0 ? '/api/agent/list' : `/api/agent/list?clientType=${clientType}`;
    // 获取请求实体
    const httpUtil = new HttpUtil();
    httpUtil.getRequest(uri,(jsonRes) => {
      sessionStorage.setItem('agent_list_in_Theme',JSON.stringify(jsonRes.agentlist));
      this.setState({
        data: jsonRes.agentlist
      })
    });
  };

  /**
   * 获取门户列表
   */
  getPortalList = () => {
    //请求参数
    const uri = '/api/portal/list';
    // 获取请求实体
    const httpUtil = new HttpUtil();
    httpUtil.getRequest(uri,(jsonRes) => {
      sessionStorage.setItem('portal_list_in_Theme',JSON.stringify(jsonRes.portallist));
      const data = jsonRes.portallist.filter(item => item.client_type === this.props.clientType);
      this.setState({
        portalData: data
      })
    });
  };

  /**
   * 获取部门列表
   */
  getOrgList = () => {
    //请求参数
    const uri = '/api/department/list?fetch_child=0';
    // 获取请求实体
    const httpUtil = new HttpUtil();
    httpUtil.getRequest(uri,(jsonRes) => {
      const arr = [];
      jsonRes.department.map(dept => {
        arr[dept.id] = dept.name;
      });

      this.setState({
        treeDate: this.props.hrmStore.getData(jsonRes),
        deptNameId: arr
      });
    });
  };

  /**
   * agentList列表渲染
   */
  renderAgent = (item) => {
    const src = MediaUtil.getMediaUrl(item.logo.media_id);
    const checked = this.state.agid.indexOf(item.id) !== -1;
    return (
      <List.Item actions={[<Checkbox checked={checked} onChange={this.check.bind(this, item)}/>]}>
        <img width={30} height={30} alt="" src={src}/>
        <span>{item.name}</span>
      </List.Item>
    )
  };

  /**
   * portalList列表渲染
   */
  renderPortal = (item) => {
    const checked = this.state.portal_id.indexOf(item.portal_id) !== -1;
    return (
      <List.Item actions={[<Checkbox checked={checked} onChange={this.check.bind(this, item)}/>]}>
        <span>{item.portal_name}</span>
      </List.Item>
    )
  };

  /**
   * 生成组织结构树
   * @param data
   * @returns {string}
   */
  treeRnder = (data) => {
    if (!data || !(data instanceof Array)) {
      return;
    }
    const {viewid, manid} = this.state;
    return data.length ? data.map(item => {
      let children = this.renderChild(item);

      const mancheck = manid.indexOf(item.id) !== -1;
      const viewcheck = viewid.indexOf(item.id) !== -1 || mancheck;

      return (
        <TreeNode
          title={
            <div className="wea-tree-title">
              <Icon type="folder" size="small"/>
              <span style={{marginLeft: 10}}>{item.name}</span>
              <Checkbox name="view" checked={viewcheck} disabled={mancheck} onChange={this.check.bind(this, item)}/>
              <Checkbox name="manage" checked={mancheck} onChange={this.check.bind(this, item)}/>
            </div>
          }
          key={item.id}
          selectable={false}
        >
          {children}
        </TreeNode>
      )
    }) : 'loading tree'
  };

  /**
   * 企业组织架构（部门）
   */
  renderChild = (item) => {

    //存储所有的子节点
    let children = [];

    const {viewid, manid} = this.state;

    //部门渲染
    if (item.children && item.children.length > 0) {
      let deptList = item.children.map(dept => {

        const mancheck = manid.indexOf(dept.id) !== -1;
        const viewcheck = viewid.indexOf(dept.id) !== -1 || mancheck;

        if (dept.children && dept.children.length === 0) {
          return (
            <TreeNode
              title={
                <div className="wea-tree-title">
                  <Icon type="folder" size="small"/>
                  <span style={{marginLeft: 10}}>{dept.name}</span>
                  <Checkbox name="view" checked={viewcheck} disabled={mancheck} onChange={this.check.bind(this, dept)}/>
                  <Checkbox name="manage" checked={mancheck} onChange={this.check.bind(this, dept)}/>
                </div>
              }
              key={dept.id}
              selectable={false}
              isLeaf
            />
          );
        }

        return (
          <TreeNode
            title={
              <div className="wea-tree-title">
                <Icon type="folder" size="small"/>
                <span style={{marginLeft: 10}}>{dept.name}</span>
                <Checkbox name="view" checked={viewcheck} disabled={mancheck} onChange={this.check.bind(this, dept)}/>
                <Checkbox name="manage" checked={mancheck} onChange={this.check.bind(this, dept)}/>
              </div>
            }
            key={dept.id}
            selectable={false}
          >
            {this.renderChild(dept)}
          </TreeNode>
        );
      });

      children.push(deptList);
    }
    return children;
  };
}

WeaPermission.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  defaultSelected: PropTypes.object,
};