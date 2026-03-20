import type { ApiProduct, ApiTopping, ApiSize, ApiBranch, Product, Topping, Size, Branch } from "./types";
import { getColorAccent } from "./mock-data";

export function apiProductToProduct(api: ApiProduct): Product {
  return {
    id: api.id,
    name: api.name,
    nameVi: api.name,
    description: api.description ?? "",
    category: api.categoryName ?? "",
    categoryId: api.categoryId,
    price: parseFloat(api.basePrice),
    imageUrl: api.imageUrl,
    salesStatus: api.salesStatus,
    colorAccent: getColorAccent(api.name),
  };
}

export function apiToppingToTopping(api: ApiTopping): Topping {
  return {
    id: api.id,
    name: api.name,
    price: parseFloat(api.price),
  };
}

export function apiSizeToSize(api: ApiSize): Size {
  return {
    id: api.id,
    name: api.name,
    additionalPrice: parseFloat(api.additionalPrice),
  };
}

export function apiBranchToBranch(api: ApiBranch): Branch {
  return {
    id: api.id,
    name: api.name,
    address: api.address ?? "",
    phoneNumber: api.phoneNumber ?? "",
    operatingStatus: api.operatingStatus,
    openingTime: api.openingTime,
    closingTime: api.closingTime,
  };
}
