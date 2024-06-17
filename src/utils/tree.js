 
export const handleTreeData = (list) => {
    //封装一个方法 首先需要确定一个返回值TreeList
    const TreeList= [];
    // 将id和item 做一个映射关系newObj
    const newObj= {};
    list.forEach((item) => (newObj[item.NodeId] = item));
   
    list.forEach((item) => {
      //如果item.id 和 pid 一致 
      if (newObj[item.PNodeId]) {
        //如果item.id 和 pid 一致 且该item上没有children属性 该children为空
        if (!newObj[item.PNodeId]["children"]) newObj[item.PNodeId]["children"] = [];
        //如果item.id 和 pid 一致 且该item上有children属性 该children为item
        newObj[item.PNodeId]["children"].push(item);
      } else {
      //如果item.id 和 pid 不一致 
        TreeList.push(item);
      }
    });
    console.log("TreeList", TreeList);
    return TreeList;
  };