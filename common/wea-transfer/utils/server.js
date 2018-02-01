import HttpUtil from '../../../../utils/http';
import tools from './tools';

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
    httpUtil.getRequest(uri,(jsonRes) => {
      getResponse(jsonRes.department,this.tools.getData(jsonRes));
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
    httpUtil.getRequest(uri,(jsonRes) => {
      getResponse(jsonRes.taglist);
    });
  };
}
