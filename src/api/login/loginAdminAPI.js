import apiClient from "../apiClient";

const loginAdmin = async (adminData) => {
  try {

    const response = await apiClient.post('/login/admin', adminData);

    return {
      status : response.status,
      body : response.data
    }

  } catch (error) {
    if (error.response.status === 401) {
      return {
        statusCode: 401,
        message: "인증 에러",
      };
    }
  }
};

export default loginAdmin;
