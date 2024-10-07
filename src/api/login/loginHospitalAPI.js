import apiClient from "../apiClient";

const loginHospital = async (id, password) => {
  try {
    const response = await apiClient.post('/login', { id,password });

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

    if (error.response && error.response.status === 403) {
      return {
        statusCode: 403,
        message: "블랙리스트된 사용자입니다.",
        userId: error.response.data.data
      };
    } else if (error.response && error.response.status === 404) {
      return {
        statusCode: 404,
        message: "사용자 조회 불가"
      };
    }

    return {
      status: error.response.status,
      body: {
        message: "오류 발생"
      }
    };
  }
};

export default loginHospital;
