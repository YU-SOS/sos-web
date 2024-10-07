import apiClient from "../apiClient";

const loginAdmin = async (adminData) => {
  try {
    const response = await apiClient.post('/login/admin', adminData);

    const accessToken = response.headers['authorization'];

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      console.error("Access token not found in response:", response);
    }

    return {
      status: response.status,
      body: response.data,
    };
  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 401) {
      return {
        statusCode: 401,
        message: "인증 에러",
      };
    } else {
      return {
        statusCode: error.response ? error.response.status : 500,
        message: "오류 발생",
      };
    }
  }
};

export default loginAdmin;
