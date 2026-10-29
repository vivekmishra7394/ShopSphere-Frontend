import api from "../api/Axios";


export const getAllProducts = async (page = 0, size = 20) => {
  const response = await api.get("/api/products", {
    params: { page, size },
  });

  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(
    `/api/products/get-product-by-id/${encodeURIComponent(id)}`
  );

  return response.data;
};

export const getProductByName = async (name) => {
  const response = await api.get(
    `/api/products/get-product-by-name/${encodeURIComponent(name)}`
  );

  return response.data;
};