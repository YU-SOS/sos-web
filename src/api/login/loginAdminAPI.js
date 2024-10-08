import apiClient from "../apiClient";

const loginAdmin = async (adminData) => {
  try {
    const response = await apiClient.post('/login/admin', adminData);

    let accessToken = response.headers['authorization'];
    if (accessToken && accessToken.startsWith('Bearer ')) {
      accessToken = accessToken.substring(7);
    }

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      console.error("Access token not found in response:", response);
    }

    return {
      status: response.status,
      body: response.data,
      accessToken,
    };
  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 401) {
      return {
        status: 401,
        message: "인증 에러",
      };
    } else {
      return {
        status: error.response ? error.response.status : 500,
        message: "오류 발생",
      };
    }
  }
};

export default loginAdmin;
