import apiClient from "../apiClient";

const loginHospital = async (hospitalData) => {
  try {
    const response = await apiClient.post('/login', hospitalData);

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

    if (error.response && error.response.status === 403) {
      return {
        status: 403,
        message: "블랙리스트된 사용자입니다.",
      };
    } else if (error.response && error.response.status === 404) {
      return {
        status: 404,
        message: "사용자 조회 불가"
      };
    }

    return {
      status: error.response ? error.response.status : 500,
      message: "오류 발생"
    };
  }
};

export default loginHospital;