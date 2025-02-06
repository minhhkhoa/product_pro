export const getProductsFeatured = async () => {
  try {
    const response = await fetch('https://be-pv7fns04p-minhkhoas-projects.vercel.app/products/featured');

    // Kiểm tra nếu response không hợp lệ
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const products = await response.json();

    // Trả về dữ liệu thành công
    return {
      ok: true,
      data: products
    };
  } catch (error) {
    // Xử lý lỗi và trả về thông tin lỗi
    console.error('Failed to fetch products: ', error);
    return {
      ok: false,
      error: error.message
    };
  }
};

export const findProductBySlug = async (slug) => {
  try {
    const response = await fetch(`https://be-pv7fns04p-minhkhoas-projects.vercel.app/products/findProductBySlug/${slug}`);

    // Kiểm tra nếu response không hợp lệ
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    // Trả về dữ liệu thành công
    return {
      ok: true,
      data: result.product,
      sameProduct: result.sameProduct
    };
  } catch (error) {
    // Xử lý lỗi và trả về thông tin lỗi
    console.error('Failed to fetch find products by slug: ', error);
    return {
      ok: false,
      error: error.message
    };
  }
}

export const fetchDataProduct = async ( search, categoryId) => {
  let url = `https://be-pv7fns04p-minhkhoas-projects.vercel.app/products`;
  if (search) {
    url += `&search=${search}`;
  }
  if (categoryId) {
    url += `&category=${categoryId}`;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
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

export const dataCategoryById = async (id) => {
  try {
    const response = await fetch(
      `https://be-pv7fns04p-minhkhoas-projects.vercel.app/products/getProductsByCategoryId/${id}`, {
      method: "GET",
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

export const searchProduct = async (value) => {
  try {
    const response = await fetch(
      `https://be-pv7fns04p-minhkhoas-projects.vercel.app/products/search?search=${value}`, {
      method: "GET",
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

