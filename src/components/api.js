const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-42",
  headers: {
    authorization: "11feec4b-7809-41be-a716-f208355d1303",
    "Content-Type": "application/json",
  },
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((error) => {
    error.httpResponseCode = res.status;
    return Promise.reject(error);
  });
}

export const loadCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "GET",
    headers: config.headers,
  }).then(checkResponse);
};

export const getProfile = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "GET",
    headers: config.headers,
  }).then(checkResponse);
};

export const editProfile = (name, job) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name: name,
      about: job,
    }),
  }).then(checkResponse);
};

export const addCard = (newName, newLink) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      link: newLink,
    }),
  }).then(checkResponse);
};

export const removeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
};

export function toggleLike(cardId, isLiked) {
  const endPoint = `${config.baseUrl}/cards/likes/${cardId}`;
  const fetchOptions = {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  };
  return fetch(endPoint, fetchOptions).then(checkResponse);
}

export const avatarChange = (url) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar: url,
    }),
  }).then(checkResponse);
};
