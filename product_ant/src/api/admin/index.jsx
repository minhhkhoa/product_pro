import Notification from "../../utils/Notification";
import { convertToTree } from "../../utils/ConvertTreeData";

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

export const deleteItem = async (productToDelete) => {
  return fetch(`http://localhost:3000/admin/products/delete/${productToDelete}`, { //-trả về promise
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(() => {
      Notification("success", "Thành công", "Sản phẩm đã được xóa thành công!");
    })
    .catch((error) => {
      Notification("error", "Lỗi", "Có lỗi xảy ra khi xóa sản phẩm!");
      console.error("Error:", error);
      throw error;  // Đảm bảo Promise bị reject khi có lỗi
    });
};

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

export const getDataCategory = async (typeData=null) => {
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

export const editItem = async (formData, id) => {
  const res = await fetch(`http://localhost:3000/admin/products/edit/${id}`, {
    method: 'PATCH', // Sử dụng PATCH cho cập nhật
    body: formData,
  });
  if (res.ok) {
    Notification("success", "Thành công", "Sản phẩm đã được cập nhật thành công!");
  } else {
    Notification("error", "Lỗi", "Đã có lỗi xảy ra khi cập nhật sản phẩm!");
  }
} 

export const createItem = async (formData, setLoading) => {
  setLoading(true); // Bật trạng thái loading
  const res = await fetch("http://localhost:3000/admin/products/create", {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    Notification("success", "Thành công", "Sản phẩm đã được thêm thành công!");
  } else {
    Notification("error", "Lỗi", "Đã có lỗi xảy ra khi tạo sản phẩm!");
  }
  setLoading(false); // Tắt trạng thái loading
};

//-end api product
