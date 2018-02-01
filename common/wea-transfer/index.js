import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { Tree, Input, Icon, Modal, Checkbox, Tabs } from 'antd';
import './styles/weatransfer.less';
import tools from './utils/tools';
import Request from './utils/server';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;

export default class WeaTransfer extends React.Component {
  static defaultProps = {
    title: '选择范围',
    subtitle: '已选择数据',
    advanced: ['dept'],
    placeholder: "搜索部门"
  };

  constructor(props) {
    super(props);
    this.tools = new tools();
    this.Request = new Request();
    this.state = {
      expandedKeys: [],
      matchKeys: [],
      searchValue: '',
      selected: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 },
      selectedNodes: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 },
      unsortNodes: [],
      leftContent: 'tree',
      subordinate: true,
      mydeptChecked: false,
      nextDept: false,
      disabled: false,
      autoExpandParent: false,
      taglist: [],//标签列表
      searchData: [],//搜索对比数据
      orgPerson: [],
      smallScreen: false
    };
    this.userex = 'userlist-+';
    this.tagex = 'taglist-+-';
    this.deptex = 'deptlist-+';
    this.minedeptex = 'minedept-+';
    this.partyex = 'partylist-';
  };

  componentDidMount() {
    const { advanced } = this.props;

    if (window.innerWidth < 1600) {
      this.setState({
        smallScreen: true
      })
    }

    //获取MobTransfer组件组织结构（部门及人员）
    this.Request.getOrgInTransfer((depts,data) => this.setState({
      searchData: depts,
      orgPerson: data
    }));

    if (advanced.includes('tag')){
      //获取企业标签列表
      this.Request.getTagList((taglist) => {
        this.setState({
          taglist: taglist
        })
      });
    }
  }

  componentWillReceiveProps(props) {

    if (!props.visible) {
      //关闭弹窗时不作任何处理
      return
    }

    if (props.advanced.includes('nextdept') || props.advanced.includes('party')) {
      this.setState({
        nextDept: true
      })
    }

    if (props.advanced.length === 1 && props.advanced.includes('person')) {
      this.setState({
        disabled: true
      })
    }

    //按输入为组件添加默认选中和默认展开
    if (props.defaultSelected) {

      if (props.defaultSelected === this.state.selected) {

        return false

      } else {
        let selected = props.defaultSelected;
        let keys = { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 };
        let nodes = { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 };
        let unsortNodes = [];

        let id = '';
        let newitem = {};
        if (selected.mydept) {
          if (selected.mydept === 5 || selected.mydept === 6) {
            this.setState({
              mydeptChecked: true
            })
          }
          keys.mydept = selected.mydept;
          nodes.mydept = selected.mydept;
          unsortNodes.push({id: 'mydept', key: 'mydept', name: '本部门'});
        }
        for (let t in selected) {
          let ex = { 'userlist' : this.userex, 'deptlist' : this.deptex, 'partylist' : this.partyex, 'taglist' : this.tagex };
          selected[t] instanceof Array && selected[t].forEach(item => {
            id = `${ex[t]}${item.id}`;
            newitem = {'id': id, 'name': item.name};
            keys[t].push(id);
            nodes[t].push(newitem);
            unsortNodes.push(newitem);
          });
        };

        this.setState({
          selected: keys,
          selectedNodes: nodes,
          unsortNodes: unsortNodes
        });
      }

    } else {
      this.setState({
        selected: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 }
      })
    }
  };

  render() {
    const {
      title,
      subtitle,
      visible,
      advanced,
      placeholder
    } = this.props;

    const {
      expandedKeys,
      leftContent,
      mydeptChecked,
      taglist,
      orgPerson,
      autoExpandParent,
      smallScreen
    } = this.state;

    const tagshow = advanced.length === 1 && advanced.includes('tag');

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.cancel}
        style={{
          top: smallScreen ? 30 : 100
        }}
        width={850}
        okText="确认"
        cancelText="取消"
      >
        <div className="member-tree transferTree">
          <Search
            style={{ marginBottom: 8 }}
            placeholder={placeholder}
            onSearch={(val) => this.search(val)}
          />
          {advanced.includes('tag') && !tagshow &&
          <div className="type">
            <Tabs onChange={this.changeLeftContent}>
              <TabPane tab="组织架构" key="tree"/>
              <TabPane tab="标签" key="tag"/>
            </Tabs>
          </div>}
          <Scrollbars
            autoHide
            style={{
              height: advanced.includes('tag') ? 352 : 400,
              background: '#F9FAFC'
            }}
          >
            {advanced.includes('mydept') &&
            <Checkbox
              onChange={this.mineDept}
              ref="mydept"
              name="mydept"
              style={{marginLeft:29,marginTop:10}}
              checked={mydeptChecked}
            >
              本部门
            </Checkbox>}

            {leftContent === 'tree' && (advanced.includes('dept') || advanced.includes('party') || this.state.disabled) &&
            <Tree
              key
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              onSelect={this.onSelect}
              autoExpandParent={autoExpandParent}
            >
              {this.treeRnder(orgPerson)}
            </Tree>}
            {(leftContent === 'tag' || tagshow) &&
            <Tree
              key
              onSelect={this.onSelect}
            >
              {this.tagRender(taglist)}
            </Tree>}
          </Scrollbars>
        </div>
        <div className="transferSelectedContent">
          <ul>
            <li className="title">{subtitle}<span onClick={this.reset}>清空</span></li>
            <Scrollbars
              autoHide
              style={{
                height: 400,
                background: '#F9FAFC'
              }}
            >
              {this.getSelectedContent()}
            </Scrollbars>
          </ul>
        </div>
      </Modal>
    )
  }

  /**
   * 选择是否包含本部门
   */
  mineDept = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { selected, selectedNodes, unsortNodes } = this.state;
    let arr = selected;
    let arr1 = selectedNodes;
    let newNodes = unsortNodes;
    let key = e.target.name;

    if (e.target.checked) {
      arr.mydept = 5;
      arr1.mydept = 5;
      newNodes = [...newNodes,{id: key, name: '本部门'}];
      this.setState({
        mydeptChecked: !this.state.mydeptChecked,
        selected: arr,
        selectedNodes: arr1,
        unsortNodes: newNodes
      });
    } else if (!e.target.checked) {
      arr.mydept = 0;
      arr1.mydept = 0;
      newNodes.splice(newNodes.indexOf(newNodes.filter(item => item.id === key)[0]), 1);
      this.setState({
        mydeptChecked: !this.state.mydeptChecked,
        selected: arr,
        selectedNodes: arr1,
        unsortNodes: newNodes
      });
    }
  };

  /**
   * 修改是否包含下级部门
   */
  subordinate = (e) => {
    e.stopPropagation();

    let key = e.target.name;
    const { selected, selectedNodes, unsortNodes } = this.state;
    let obj = selected;
    let obj1 = selectedNodes;

    if (key === 'mydept') {
      if (e.target.checked) {
        obj.mydept = 5;
        obj1.mydept = 5;
      } else if (!e.target.checked) {
        obj.mydept = 6;
        obj1.mydept = 6;
      }
      this.setState({
        selected: obj,
        selectedNodes: obj1
      });
      return
    }

    if (e.target.checked) {

      obj.deptlist.splice(obj.deptlist.indexOf(key),1);
      obj.partylist.push(`${this.partyex}${key.slice(10)}`);
      let item = obj1.deptlist.filter(item => item.id === key)[0];
      if (item && item.id) {
        item.id = `${this.partyex}${item.id.slice(10)}`;
      }
      obj1.partylist.push(item);
      obj1.deptlist.splice(obj1.deptlist.indexOf(obj1.deptlist.filter(item => item.id.slice(10) === key.slice(10))[0]),1);
      unsortNodes.forEach(item => {
        if (item.id === key) {
          let tail = item.id.slice(10);
          item.id = `${this.partyex}${tail}`;
        }
      });
      this.setState({
        selected: obj,
        selectedNodes: obj1,
        unsortNodes: unsortNodes
      })
    } else {
      obj.partylist.splice(obj.partylist.indexOf(key),1);
      obj.deptlist.push(`${this.deptex}${key.slice(10)}`);
      let item = obj1.partylist.filter(item => item.id === key)[0];
      if (item.id) {
        item.id = `${this.deptex}${item.id.slice(10)}`;
      }
      obj1.deptlist.push(item);
      obj1.partylist.splice(obj1.partylist.indexOf(obj1.partylist.filter(item => item.id.slice(10) === key.slice(10))[0]),1);
      unsortNodes.forEach(item => {
        if (item.id === key) {
          let tail = item.id.slice(10);
          item.id = `${this.deptex}${tail}`;
        }
      });
      this.setState({
        selected: obj,
        selectedNodes: obj1,
        unsortNodes: unsortNodes
      })
    }
  };

  /**
   * 取消或关闭弹框时执行
   * 清空搜索框
   */
  cancel = () => {
    const {  onCancel } = this.props;
    this.setState({
      mydeptChecked: false,
      unsortNodes: [],
      expandedKeys: [],
      searchValue: '',
      matchKeys: [],
      selected: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 },
      selectedNodes: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 }
    });

    //调用传入的关闭窗口函数
    onCancel();
  };

  /**
   * 改变组织结构树左侧内容
   */
  changeLeftContent = (key) => {
    this.setState({
      leftContent: key
    });
  };

  //清空选中
  reset = () => {
    this.setState({
      mydeptChecked: false,
      unsortNodes: [],
      selected: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 },
      selectedNodes: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 }
    })
  };

  //设置部门
  onOk = () => {
    const { onSubmit } = this.props;
    const { selected, selectedNodes } = this.state;

    for (let key of Object.keys(selected)) {
      if ( selected[key] instanceof Array && selected[key].length > 0) {
        selected[key] = selected[key].map(item => {
          return item.slice(10);
        })
      }
    }

    for (let key of Object.keys(selectedNodes)) {
      if ( selectedNodes[key] instanceof Array && selectedNodes[key].length > 0) {
        selectedNodes[key].forEach(item => {
          item.id = item.id.slice(10);
        })
      }
    }

    //调用传入的提交函数
    onSubmit(selected,selectedNodes);

    //清空数据
    this.setState({
      expandedKeys: [],
      selected: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 },
      selectedNodes: { 'userlist': [], 'deptlist': [], 'partylist': [], 'taglist': [], 'mydept': 0 }
    });
  };

  //取消选中部门
  regret = (key) => {
    const { selected, selectedNodes, unsortNodes } = this.state;
    //selected 和 selectedNodes为Object
    let arr = selected;
    let arr1 = selectedNodes;
    let newNodes = unsortNodes;

    if (key === 'mydept') {
      arr.mydept = 0;
      arr1.mydept = 0;
      newNodes.splice(newNodes.indexOf(newNodes.filter(item => item.id === key)[0]), 1);
      this.setState({
        mydeptChecked: false,
        selected: arr,
        selectedNodes: arr1,
        unsortNodes: newNodes
      });
      return
    }

    let keypiece = key.slice(0,10);
    let ex = '';
    switch (keypiece) {
      case this.userex:
        ex = 'userlist';
        break;
      case this.deptex:
        ex = 'deptlist';
        break;
      case this.partyex:
        ex = 'partylist';
        break;
      case this.tagex:
        ex = 'taglist';
        break;
    };
    arr[ex].splice(arr[ex].indexOf(key), 1);
    //filter过滤后数据为数组，需要取第一项
    arr1[ex].splice(arr1[ex].indexOf(arr1[ex].filter(item => item.id === key)[0]), 1);
    newNodes.splice(newNodes.indexOf(newNodes.filter(item => item.id === key)[0]), 1);
    this.setState({
      selected: arr,
      selectedNodes: arr1,
      unsortNodes: newNodes
    });
  };

  //展开节点
  onExpand = (expandedKeys) => {
    this.isAutoExpandParent(false);
    this.setState({
      expandedKeys
    })
  };

  /**
   * isAutoExpandParent 控制树可否自动展开父节点
   */
  isAutoExpandParent = (bool) => {
    this.setState({
      autoExpandParent: bool
    })
  };

  /**
   * 选择节点
   * 1. 重复时删除
   * 2. 不存在时添加
   */
  onSelect = (k,val) => {
    //解决Tree组件连续点击产生问题
    if (k.length <= 0) {
      return
    };
    //将数组结构的k转换为字符串结构的key
    let key = String(k);
    const { selected, selectedNodes, unsortNodes } = this.state;
    //selected 和 selectedNodes为Object
    let arr = selected;
    let arr1 = selectedNodes;
    let newNodes = unsortNodes;
    let keypiece = key.slice(0,10);
    let ex = '';
    switch (keypiece) {
      case this.userex:
        ex = 'userlist';
        break;
      case this.deptex:
        ex = 'deptlist';
        break;
      case this.partyex:
        ex = 'partylist';
        break;
      case this.tagex:
        ex = 'taglist';
        break;
    };
    if (arr[ex].indexOf(key) !== -1) {
      arr[ex].splice(arr[ex].indexOf(key), 1);
      //filter过滤后数据为数组，需要取第一项
      arr1[ex].splice(arr1[ex].indexOf(arr1[ex].filter(item => item.id === key)[0]), 1);
      arr1[ex].splice(arr1[ex].indexOf(arr1[ex].filter(item => item.id === key)[0]), 1);
      newNodes.splice(newNodes.indexOf(newNodes.filter(item => item.id === key)[0]), 1);
      this.setState({
        selected: arr,
        selectedNodes: arr1,
        unsortNodes: newNodes
      });
      return true
    } else if (val.selected) {
      const name = val.selectedNodes[0].props.title.props.children[1].props.children;
      arr[ex] = [...arr[ex],key];
      arr1[ex] = [...arr1[ex],{id: key, name: name}];
      newNodes = [...newNodes,{id: key, name: name}];
      this.setState({
        selected: arr,
        selectedNodes: arr1,
        unsortNodes: newNodes
      });
      return true
    }
  };

  /**
   * 企业组织架构（部门）
   */
  renderChild = (item) => {
    const { advanced } = this.props;
    const {selected} = this.state;
    let havePerson = advanced.includes('person');
    //存储所有的子节点
    let children = [];
    if (havePerson) {
      //人员渲染
      if (item.hrmUserList && item.hrmUserList.length > 0) {
        let userList = item.hrmUserList.map((k) => {
          let key = `${this.userex}${k.userid}`;
          let match = this.state.matchKeys.indexOf(key) > -1;
          return (
            <TreeNode
              title={
                <div>
                  <Icon type="user" size="small"/>
                  <span style={{ marginLeft: 10 }} className={match ? 'searched' : ''}>{k.name}</span>
                  {selected.userlist.indexOf(key) !== -1 && <Icon type="check" size="small"/>}
                </div>
              }
              key={key}
              isLeaf
            />
          );
        });
        children.push(userList);
      }
    }
    //部门渲染
    if (item.children && item.children.length > 0) {
      let deptList = item.children.map(dept => {
        let key = `${this.deptex}${dept.id}`;
        let key1 = `${this.deptex}${dept.id}`;
        let bool1 = selected.deptlist.indexOf(key1) !== -1;
        let key2 = `${this.partyex}${dept.id}`;
        let bool2 = selected.partylist.indexOf(String(key2)) !== -1;
        let ischecked = bool1 || bool2;
        let match = this.state.matchKeys.indexOf(key) > -1;
        if (havePerson) {
          if (dept.children && dept.children.length === 0 && dept.hrmUserList.length === 0) {
            return (
              <TreeNode
                title={
                  <div style={{ color: this.state.disabled ? '#aaa' : '#000000a6' }}>
                    <Icon type="folder" size="small"/>
                    <span style={{ marginLeft: 10 }} className={match ? 'searched' : ''}>{dept.name}</span>
                    {ischecked && <Icon type="check" size="small"/>}
                  </div>
                }
                key={key}
                selectable={!this.state.disabled}
                isLeaf
              >
              </TreeNode>
            );
          }
        } else if (dept.children && dept.children.length === 0) {
          return (
            <TreeNode
              title={
                <div style={{ color: this.state.disabled ? '#aaa' : '#000000a6' }}>
                  <Icon type="folder" size="small"/>
                  <span style={{ marginLeft: 10 }} className={match ? 'searched' : ''}>{dept.name}</span>
                  {ischecked && <Icon type="check" size="small"/>}
                </div>
              }
              key={key}
              selectable={!this.state.disabled}
              isLeaf
            >
            </TreeNode>
          );
        };
        return (
          <TreeNode
            title={
              <div style={{ color: this.state.disabled ? '#aaa' : '#000000a6' }}>
                <Icon type="folder" size="small"/>
                <span style={{ marginLeft: 10 }} className={match ? 'searched' : ''}>{dept.name}</span>
                {ischecked && <Icon type="check" size="small"/>}
              </div>
            }
            key={key}
            selectable={!this.state.disabled}
          >
            {this.renderChild(dept)}
          </TreeNode>
        );
      });
      children.push(deptList);
    }

    return children;
  };

  /**
   * 组织结构树渲染
   * @param data
   */
  treeRnder = (data) => {

    if (!data || !(data instanceof Array)) {
      return;
    };
    const { selected } = this.state;
    return data.map(item => {
      let children = this.renderChild(item);
      let key = `${this.deptex}${item.id}`;
      let key1 = `${this.deptex}${item.id}`;
      let bool1 = selected.deptlist.indexOf(key1) !== -1;
      let key2 = `${this.partyex}${item.id}`;
      let bool2 = selected.partylist.indexOf(String(key2)) !== -1;
      let ischecked = bool1 || bool2;
      let match = this.state.matchKeys.indexOf(key) > -1;

      return (
        <TreeNode
          title={
            <div style={{ color: this.state.disabled ? '#aaa' : '#000000a6' }}>
              <Icon type="folder" size="small"/>
              <span style={{ marginLeft: 10 }} className={match ? 'searched' : ''}>{item.name}</span>
              {ischecked && <Icon type="check" size="small"/>}
            </div>
          }
          key={key}
          selectable={!this.state.disabled}
        >
          {children}
        </TreeNode>
      )
    })
  };

  /**
   * 标签列表渲染
   * @param data
   */
  tagRender = (data) => {
    if (!data || !(data instanceof Array)) {
      return;
    }
    return data.map(item => {
      let key = `${this.tagex}${item.tagid}`;
      return (
        <TreeNode
          title={
            <div>
              <Icon type="tag-o" size="small"/>
              <span style={{ marginLeft: 10 }}>{item.tagname}</span>
              {this.state.selected.taglist.indexOf(key) !== -1&&<Icon type="check" size="small"/>}
            </div>
          }
          key={key}
          isLeaf
        />
      )
    })
  };

  //右侧选中列表渲染
  getSelectedContent = () => {

    const { unsortNodes, selectedNodes } = this.state;

    let nodes = [];

    unsortNodes.forEach(item => {
      let idpiece = item.id.slice(0,10);

      if ('mydept' === idpiece && this.state.mydeptChecked) {
        const checked = selectedNodes.mydept === 5 ? true : (selectedNodes.mydept === 6 ? false : true);
        nodes.push(
          <li key='mydept'>
            <Icon type='folder' size="small"/>
            <span>本部门</span>
            <Icon type="close" size="small" onClick={this.regret.bind(this,'mydept')}/>
            {this.state.nextDept && <Checkbox name='mydept' defaultChecked={checked} onChange={this.subordinate}>含下级部门</Checkbox>}
          </li>
        )
      }

      if (this.deptex === idpiece) {
        nodes.push(
          <li key={item.id}>
            <Icon type='folder' size="small"/>
            <span>{item.name}</span>
            <Icon type="close" size="small" onClick={this.regret.bind(this, item.id)}/>
            {this.state.nextDept && <Checkbox name={item.id} defaultChecked={false} onChange={this.subordinate}>含下级部门</Checkbox>}
          </li>
        )
      }

      if (this.partyex === idpiece) {
        nodes.push(
          <li key={item.id}>
            <Icon type='folder' size="small"/>
            <span>{item.name}</span>
            <Icon type="close" size="small" onClick={this.regret.bind(this, item.id)}/>
            <Checkbox name={item.id} defaultChecked={true} onChange={this.subordinate}>含下级部门</Checkbox>
          </li>
        )
      }

      if (this.tagex === idpiece) {
        nodes.push(
          <li key={item.id}>
            <Icon type='tag-o' size="small"/>
            <span>{item.name}</span>
            <Icon type="close" size="small" onClick={this.regret.bind(this, item.id)}/>
          </li>
        )
      }

      if (this.userex === idpiece) {
        nodes.push(
          <li key={item.id}>
            <Icon type='user' size="small"/>
            <span>{item.name}</span>
            <Icon type="close" size="small" onClick={this.regret.bind(this, item.id)}/>
          </li>
        )
      }

    });

    return <ul>{nodes}</ul>
  };

  /**
   * 搜索
   * @param data
   * @param tree
   * @param e
   */
  search = (val) => {
    //设置树节点可自动展开
    this.isAutoExpandParent(true);
    //获取搜索框输入
    const value = val;
    if (value === '') {
      this.setState({
        expandedKeys: []
      });
      return
    }
    const { searchData, orgPerson } = this.state;
    let list = searchData;
    /**
     * 根据输出获取展开值
     * data为部门一维数据
     */
    let expandedKeys = [];
    let matchKeys = [];

    list.forEach((item) => {
      if (item.name.indexOf(value) > -1) {
        /**
         *  如果输入值key存在，查找该节点的父节点
         */
        matchKeys.push(`${this.deptex}${item.id}`);
        expandedKeys = expandedKeys.concat(this.getParentKey(item.id, orgPerson));
      } else if (item.hrmUserList && item.hrmUserList.length > 0) {
        /**
         * 搜索名目为人员
         * @type {Array}
         */
        let parentKeys = [];
        item.hrmUserList.forEach(val => {
          if (val.name.indexOf(value) > -1) {
            if (item.id) {
              console.log('');
              matchKeys.push(`${this.userex}${val.userid}`);
              parentKeys.push(`${this.deptex}${item.id}`);
            }
          }
        });

        expandedKeys = expandedKeys.concat(parentKeys);
      } else {
        /**
         *  如果输入值key不存在，返回空
         */
      }
    });

    //expandedKeys成员类型为string,并过滤空数组
    let keys = expandedKeys.filter(item => !(item instanceof Array));

    this.setState({
      expandedKeys: keys,
      searchValue: value,
      matchKeys
    });
  };

  /**
   * 获取父节点key值，得到需要展开的节点
   */
  getParentKey = (key, tree) => {
    /**
     * key：输入值对应的Key
     * tree: 带children的组织结构树数据
     */
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[ i ];
      if (node.children) {
        /**
         * 从树顶开始查找
         * 如果存在父节点，则保存父节点key值
         */
        if (node.children.some(item => item.id === key)) {
          parentKey = `${this.deptex}${node.id}`;
        } else if (this.getParentKey(key, node.children)) {
          /**
           * 如果不存在
           * 从下一层开始查找
           */
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    /**
     * 展开节点只需找到当前节点的上一级父节点Key值
     */
    return parentKey;
  };
}

WeaTransfer.propTypes = {
  // defaultSelected: PropTypes.object,
/*  visible: PropTypes.bool.isRequired,
  advanced: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,*/
};