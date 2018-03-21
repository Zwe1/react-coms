import HttpUtil from '../../../../utils/http';
import tools from './tools';
import { mapTree } from '../../../../utils/marvel';

export default class Request {
  constructor() {
    this.tools = new tools();
  }

  /**
   * MobTransfer组件组织人员/结构树获取
   */
  getOrgInTransfer = (getResponse) => {
    //请求参数
    const uri = '/api/department/list?feach_user=1';
    // 获取请求实体
    const httpUtil = new HttpUtil();
    httpUtil.getRequest(uri, (jsonRes) => {
      console.log('jsonRes',jsonRes);
      getResponse(jsonRes.department, this.tools.getData(jsonRes));
    });
  };

  /**
   * 获取标签列表
   */
  getTagList = (getResponse) => {
    //请求参数
    const uri = '/api/tag/list';
    // 获取请求实体
    const httpUtil = new HttpUtil();
    httpUtil.getRequest(uri, (jsonRes) => {
      getResponse(jsonRes.taglist);
    });
  };

  /**
   * 异步加载组织架构
   */
  getOrgAsyncInTransfer = (id, treeNode, getResponse) => {
    //请求参数
    const uri = `/api/department/list?id=${id}&fetch_child=0&fetch_user=1`;
    const httpUtil = new HttpUtil();
    return httpUtil.getRequest(uri, (jsonRes) => {
      if (id === 0) {

        getResponse(jsonRes);

      } else {
        let newChild = jsonRes.department.map(item => {
          return {
            'key': item.id,
            'isLeaf': !item.hasnext,
            ...item
          }
        });

        if (jsonRes.userlist) {
          newChild = newChild.concat(jsonRes.userlist.map(item => {
            return {
              'key': item.userid,
              'id': item.userid,
              'isLeaf': true,
              'name': item.name,
              'isUser': true
            }
          }));
        }

        if (treeNode) {
          treeNode.props.dataRef.children = newChild;
        } else {
          mapTree(this.orgTreeAsync, id, newChild)
        }
      }
    });
  };

  /**
   * 调用后台接口搜索部门
   */
  search = (keyword,finduser,callback) => {
    const fetch_user = finduser ? 1 : 0;
    //请求参数
    const uri = '/api/department/list?id=1&feach_user='+fetch_user+'&fetch_child=1&keyword='+encodeURI(encodeURI(keyword));
    // 获取请求实体
    const httpUtil = new HttpUtil();
    httpUtil.getRequest(uri,(jsonRes) => {
      callback(jsonRes);
    });

  };

}
