export const normalizeProduct = (product = {}) => {
  return {
    id: product.id ?? product.productId ?? product.product_id,
    name:
      product.name ??
      product.productName ??
      product.title ??
      "Unnamed Product",
    description: product.description ?? product.productDescription ?? "",
    price: Number(product.price ?? product.productPrice ?? 0),
    image:
      product.imageUrl ??
      product.imageURL ??
      product.image ??
      product.productImage ??
      "",
    category: product.category ?? product.categoryName ?? "Products",
    stock: product.stock ?? product.quantity ?? null,
  };
};

export const extractProducts = (response) => {
  // ApiResponse<Page<ProductResponse>> ke expected structure ko handle karta hai.
  const payload = response?.data;

  if (Array.isArray(payload)) {
    return payload.map(normalizeProduct);
  }

  if (Array.isArray(payload?.content)) {
    return payload.content.map(normalizeProduct);
  }

  // Kuch APIs Page object ko directly return kar sakti hain.
  if (Array.isArray(response?.content)) {
    return response.content.map(normalizeProduct);
  }

  return [];
};

export const extractSingleProduct = (response) => {
  const product = response?.data ?? response;

  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return null;
  }

  return normalizeProduct(product);
};