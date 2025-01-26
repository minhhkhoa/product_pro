// Chuyển đổi danh sách danh mục thành dạng cây
export const convertToTree = (categories) => {
  const map = {};
  const tree = [];

  categories.forEach((item) => {
    //-xếp theo id
    map[item._id] = {
      value: item._id,
      label: item.title,
      children: [],
    };
  });

  categories.forEach((item) => {
    //-thêm vào cây
    if (item.parent_id) {
      map[item.parent_id]?.children.push(map[item._id]);
    } else {
      tree.push(map[item._id]);
    }
  });

  return tree;
};