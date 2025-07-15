const BASE_URL = 'http://31.97.203.184/api';

// Helper: Refresh the access token
// const refreshAccessToken = async () => {
//   const refreshToken = localStorage.getItem('refreshToken');
//   if (!refreshToken) throw new Error('No refresh token');

//   const response = await fetch(`${BASE_URL}/auth/refresh`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ refreshToken }),
//   });
//   if (!response.ok) throw new Error('Failed to refresh token');
//   const data = await response.json();
//   localStorage.setItem('accessToken', data.accessToken);
//   return data.accessToken;
// };

export const apiClient = async (url, options = {}, retry = true) => {
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  try {
    const response = await fetch(BASE_URL + url, {
      ...options,
      headers,
    });

    if (response.status === 401 && retry) {
      try {
        // const newToken = await refreshAccessToken();
        return apiClient(url, options, false);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return;
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  } catch (err) {
    console.error('[authFetch Error]', err.message);
    throw err;
  }
};
