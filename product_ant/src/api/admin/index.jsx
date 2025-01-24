import Notification from "../../utils/Notification";

//-start api product
export const fetchData = async (status = "all", search = "", categoryId = null) => {
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

//-end api product
