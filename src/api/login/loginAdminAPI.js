import apiClient from "../apiClient";

const loginAdminAPI = async (adminData) => {
  try {
    const response = await apiClient.post('/login/admin', adminData); // 서버로 로그인 데이터 전송

    // 서버로부터 Authorization 헤더에서 토큰을 받아서 처리
    let accessToken = response.headers['authorization'];
    if (accessToken && accessToken.startsWith('Bearer ')) {
      accessToken = accessToken.substring(7); // 'Bearer ' 부분을 제거
    }

    if (accessToken) {
      // 로그인 성공 시 토큰을 localStorage에 저장
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
    return {
      status: error.response ? error.response.status : 500,
      message: "오류 발생",
    };
  }
};

export default loginAdminAPI;
