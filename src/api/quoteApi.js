const getBase = () => `${import.meta.env.VITE_BASE_API || ""}/quotes`;

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

export const listQuotes = (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${getBase()}/${query ? `?${query}` : ""}`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const getQuote = (token, id) => {
  return fetch(`${getBase()}/${id}/`, {
    headers: headers(token),
  }).then(handleResponse);
};

export const createQuote = (token, data) => {
  return fetch(`${getBase()}/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const updateQuote = (token, id, data) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const partialUpdateQuote = (token, id, data) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const deleteQuote = (token, id) => {
  return fetch(`${getBase()}/${id}/`, {
    method: "DELETE",
    headers: headers(token),
  }).then(handleResponse);
};

export const approveQuote = (token, id) => {
  return fetch(`${getBase()}/${id}/approve/`, {
    method: "POST",
    headers: headers(token),
  }).then(handleResponse);
};

export const rejectQuote = (token, id, reason) => {
  return fetch(`${getBase()}/${id}/reject/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ reason }),
  }).then(handleResponse);
};

export const addQuoteItem = (token, quoteId, data) => {
  return fetch(`${getBase()}/${quoteId}/items/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  }).then(handleResponse);
};

export const removeQuoteItem = (token, quoteId, itemId) => {
  return fetch(`${getBase()}/${quoteId}/items/${itemId}/`, {
    method: "DELETE",
    headers: headers(token),
  }).then(handleResponse);
};

export const compareQuotes = (token, quoteIds) => {
  const query = new URLSearchParams({ ids: quoteIds.join(",") }).toString();
  return fetch(`${getBase()}/compare/?${query}`, {
    headers: headers(token),
  }).then(handleResponse);
};
