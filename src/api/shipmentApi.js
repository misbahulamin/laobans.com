const getBase = () => `${import.meta.env.VITE_BASE_API || ""}/shipments`;

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

export const listShipments = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${getBase()}/${query ? `?${query}` : ""}`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const getShipment = (token, id) => {
  return fetch(`${getBase()}/${id}/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const createShipment = (token, data) => {
  return fetch(`${getBase()}/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const updateShipment = (token, id, data) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const partialUpdateShipment = (token, id, data) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const deleteShipment = (token, id) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "DELETE",
    headers: headers(token),
  }).then(handleResponse);
};

export const updateShipmentStatus = (token, id, status) => {
  return fetch(`${getBase()}/${id}/status/`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ status }),
  }).then(handleResponse);
};

export const trackShipment = (token, trackingNumber) => {
  return fetch(`${getBase()}/track/${trackingNumber}/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const getShipmentHistory = (token, id) => {
  return fetch(`${getBase()}/${id}/history/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const uploadShipmentDocument = (token, id, formData) => {
  return fetch(`${getBase()}/${id}/documents/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
    body: formData,
  }).then(handleResponse);
};

export const downloadShipmentDocument = (token, id, docId) => {
  return fetch(`${getBase()}/${id}/documents/${docId}/download/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const getShipmentStats = (token) => {
  return fetch(`${getBase()}/stats/`, {
    headers: headers(token),
  }).then(handleResponse);
};
