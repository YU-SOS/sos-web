import { getAuthAxios } from '../authAxios';

const logoutAPI = async () => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.post('/logout/user');

    if (response.status === 200) {
      return {
        statusCode: 200,
        message: "로그아웃 성공",
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      message: "로그아웃 실패",
    };
  }
};

export default logoutAPI;
