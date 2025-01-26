import Notification from "../../utils/Notification";
import { convertToTree } from "../../utils/ConvertTreeData";

//-start hàm dùng chung
const nameAction = (typeRoute) => {
  switch (typeRoute) {
    case "products":
      return "Sản phẩm";
    case "products-category":
      return "Danh mục";
    case "roles":
      return "Nhóm quyền";
    case "accounts":
      return "Tài khoản";
    default:
      return "Dữ liệu";
  }
}

//-create
export const createItem = async (formData, setLoading, typeRoute) => {
  setLoading(true); // Bật trạng thái loading
  const res = await fetch(`http://localhost:3000/admin/${typeRoute}/create`, {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    Notification("success", "Thành công", `${nameAction(typeRoute)} đã được tạo thành công!`);
  } else {
    Notification("error", "Lỗi", `Đã có lỗi xảy ra khi tạo ${nameAction(typeRoute)}!`);
  }
  setLoading(false); // Tắt trạng thái loading
};

//-delete
export const deleteItem = async (id, typeRoute) => {
  return fetch(`http://localhost:3000/admin/${typeRoute}/delete/${id}`, { //-trả về promise
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(() => {
      Notification("success", "Thành công", `${nameAction(typeRoute)} đã được xóa thành công!`);
    })
    .catch((error) => {
      Notification("error", "Lỗi", `Có lỗi xảy ra khi xóa ${nameAction(typeRoute)}!`);
      console.error("Error:", error);
      throw error;  // Đảm bảo Promise bị reject khi có lỗi
    });
};

//-edit
export const editItem = async (formData, id, typeRoute) => {
  const res = await fetch(`http://localhost:3000/admin/${typeRoute}/edit/${id}`, {
    method: 'PATCH', // Sử dụng PATCH cho cập nhật
    body: formData,
  });
  if (res.ok) {
    Notification("success", "Thành công", `${nameAction(typeRoute)} đã được cập nhật thành công!`);
  } else {
    Notification("error", "Lỗi", `Có lỗi xảy ra khi cập nhật ${nameAction(typeRoute)}!`);
  }
} 
//-end hàm dùng chung

//-start api product
export const fetchDataProduct = async (status = "all", search = "", categoryId = null) => {
  let url = `http://localhost:3000/admin/products?status=${status}`;
  if (search) {
    url += `&search=${search}`;
  }
  if (categoryId) {
    url += `&category=${categoryId}`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return data.map((item) => ({
      ...item,
      key: item._id,
    }));
  } catch (error) {
    Notification.error('Failed to fetch products');
    console.error('Fetch error:', error);
    throw error;
  }
};

export const changePosition = async (newPosition, productId) => {
  fetch(
    `http://localhost:3000/admin/products/change-position/${newPosition}/${productId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(() => {
      Notification('success', 'Thành công', 'Đã thay đổi vị trí sản phẩm thành công!');
    })
    .catch((error) => {
      Notification('error', 'Lỗi', 'Không thể thay đổi vị trí sản phẩm!');
      console.log(error);
    });
}

export const changeStatus = async (newStatus, productId) => {
  return fetch(
    `http://localhost:3000/admin/products/change-status/${newStatus}/${productId}`,
    {
      method: "PATCH",
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(() => {
      Notification("success", "Thành công", "Thay đổi trạng thái sản phẩm thành công!");
    })
    .catch((error) => {
      Notification("error", "Lỗi", "Đã có lỗi xảy ra!");
      console.error("Error:", error);
    });
}

export const getDataCategory = async (typeData = null) => {
  try {
    const res = await fetch("http://localhost:3000/admin/products/getCategory");

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    if (typeData === 'flat') {
      return data;
    }
    return convertToTree(data);
  } catch (error) {
    Notification.error('Failed to fetch categories');
    console.error('Fetch error:', error);
    throw error;
  }
};

//-end api product


//-start api category
export const dataCategoryById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/products-category/getCategoryById/${id}`
    );

    // Kiểm tra nếu phản hồi không thành công
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Chuyển đổi phản hồi thành JSON
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error; // Ném lỗi để nơi sử dụng hàm này biết và xử lý
  }
};

//-end api category
