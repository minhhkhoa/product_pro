export const getProductsFeatured = async () => {
  try {
    const response = await fetch('http://localhost:3000/products/featured');

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
    const response = await fetch(`http://localhost:3000/products/findProductBySlug/${slug}`);

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
