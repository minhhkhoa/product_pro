import Notification from "../../utils/Notification";

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

//-end api product
