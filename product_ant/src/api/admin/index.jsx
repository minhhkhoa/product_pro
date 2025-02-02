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
export const createItem = async (data, setLoading, typeRoute, isJSON = false) => {
  setLoading(true); // Bật trạng thái loading

  try {
    const options = {
      method: 'POST',
      credentials: "include", // Đảm bảo gửi cookie kèm theo request
      body: isJSON ? JSON.stringify(data) : data, // Nếu là JSON, chuyển thành chuỗi JSON
    };

    if (isJSON) {
      options.headers = {
        'Content-Type': 'application/json', // Thêm header nếu là JSON
        // 'Authorization': `Bearer ${token}`
      };
    }

    const res = await fetch(`http://localhost:3000/admin/${typeRoute}/create`, options);

    if (res.ok) {
      Notification(
        "success",
        "Thành công",
        `${nameAction(typeRoute)} đã được tạo thành công!`
      );
    } else {
      Notification(
        "error",
        "Lỗi",
        `Đã có lỗi xảy ra khi tạo ${nameAction(typeRoute)}!`
      );
    }
  } catch (error) {
    console.error("Error creating item:", error);
    Notification("error", "Lỗi", "Đã xảy ra lỗi không mong muốn!");
  } finally {
    setLoading(false); // Tắt trạng thái loading
  }
};

//-edit
export const editItem = async (data, id, typeRoute, isJSON = false) => {
  //- sửa hàm editItem để có thể gửi dữ liệu dạng JSON hoặc FormData (đọc ghi chú cuối file này)
  try {
    const options = {
      method: 'PATCH',
      credentials: "include", // Đảm bảo gửi cookie kèm theo request
      body: isJSON ? JSON.stringify(data) : data, // Nếu là JSON, chuyển đổi thành chuỗi
    };

    if (isJSON) {
      options.headers = {
        'Content-Type': 'application/json', // Chỉ thêm header nếu là JSON
      };
    }

    const res = await fetch(
      `http://localhost:3000/admin/${typeRoute}/edit/${id}`,
      options
    );

    if (res.ok) {
      Notification(
        'success',
        'Thành công',
        `${nameAction(typeRoute)} đã được cập nhật thành công!`
      );
    } else {
      Notification(
        'error',
        'Lỗi',
        `Có lỗi xảy ra khi cập nhật ${nameAction(typeRoute)}!`
      );
    }
  } catch (error) {
    console.error('Error updating item:', error);
    Notification('error', 'Lỗi', 'Đã xảy ra lỗi không mong muốn!');
  }
};

//-delete
export const deleteItem = async (id, typeRoute) => {
  return fetch(`http://localhost:3000/admin/${typeRoute}/delete/${id}`, { //-trả về promise
    method: "DELETE",
    credentials: "include", // Đảm bảo gửi cookie kèm theo request
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
    const res = await fetch(url,{
      method: "GET",
      credentials: "include", // Đảm bảo gửi cookie kèm theo
    });
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return data.map((item) => ({
      ...item,
      key: item._id,
    }));
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const changePosition = async (newPosition, productId) => {
  fetch(
    `http://localhost:3000/admin/products/change-position/${newPosition}/${productId}`,
    {
      method: "PATCH",
      credentials: "include", // Đảm bảo gửi cookie kèm theo request
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
      credentials: "include", // Đảm bảo gửi cookie kèm theo request
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
    const res = await fetch("http://localhost:3000/admin/products/getCategory", {
      method: "GET",
      credentials: "include", // Đảm bảo gửi cookie kèm theo request
    });



    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    if (typeData === 'flat') {
      return data;
    }
    return convertToTree(data);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

//-end api product


//-start api category
export const dataCategoryById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/admin/products-category/getCategoryById/${id}`,{
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      }
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

//-start api roles
export const getAllRoles = async () => {
  try {
    const res = await fetch("http://localhost:3000/admin/roles/getAllRole",
      {
        method: "GET",
        credentials: "include", // Đảm bảo gửi cookie kèm theo request
      }
    );

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

//-end api roles

//-start api account
export const checkEmailExists = async (email) => {
  try {
    const res = await fetch(`http://localhost:3000/admin/accounts/check-email?email=${encodeURIComponent(email)}`);

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data.exists; // Giả sử API trả về { exists: true } nếu email đã tồn tại

  } catch (error) {
    console.error("Error checking email:", error);
    Notification("error", "Lỗi", "Đã xảy ra lỗi khi kiểm tra email!");
    throw error;
  }
};

//-end api account

//-start api auth
export const login = async (email, password) => {
  try {
    const res = await fetch('http://localhost:3000/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

//-end api auth




//-start ghi chú

          // 1.Cách gửi formData:
          // Khi sử dụng FormData, bạn không cần thiết lập header Content - Type 
          // vì trình duyệt tự động thêm khi gửi.
          // Dữ liệu được gửi dưới dạng multipart / form - data.

          // 2.Cách gửi JSON:
          // Khi sử dụng JSON(body: JSON.stringify(values)), bạn phải thiết lập 
          // header Content - Type là application / json để server biết rằng dữ 
          // liệu gửi lên là JSON.

//-end ghi chú