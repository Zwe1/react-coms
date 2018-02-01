export default class tools {
  /**
   * 数据二次处理，生成组织结构树
   */
  getData = (data) => {
    let roots = "";
    if (data.department && data.department.length > 0) {
      const depts = data.department;
      roots = depts.filter(i => i.parentid === 0);
      roots.forEach(root => {
        root.expanded = true;
        root.children = this.parseChild(root.id, depts);
      });
    }
    return roots;
  };

  parseChild = (parentId, arr) => {
    let children = arr.filter(item => item.parentid === parentId) || [];
    if (children.length > 0) {
      children.forEach(item => {
        item.expanded = true;
        item.children = this.parseChild(item.id, arr);
      })
    }
    return children;
  };
}
