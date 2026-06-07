const getBase = () => `${import.meta.env.VITE_BASE_API || ""}/suppliers`;

const headers = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Token ${token}`,
});

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  return response.json();
}

export const listSuppliers = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${getBase()}/${query ? `?${query}` : ""}`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const getSupplier = (token, id) => {
  return fetch(`${getBase()}/${id}/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const createSupplier = (token, data) => {
  return fetch(`${getBase()}/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const updateSupplier = (token, id, data) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const partialUpdateSupplier = (token, id, data) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const deleteSupplier = (token, id) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "DELETE",
    headers: headers(token),
  }).then(handleResponse);
};

export const getSupplierOrders = (token, id, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${getBase()}/${id}/orders/${query ? `?${query}` : ""}`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const getSupplierPerformance = (token, id) => {
  return fetch(`${getBase()}/${id}/performance/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const addSupplierContact = (token, supplierId, data) => {
  return fetch(`${getBase()}/${supplierId}/contacts/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};
