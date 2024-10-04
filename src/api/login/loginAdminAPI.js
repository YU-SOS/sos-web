import { getAuthAxios } from '../authAxios';

const loginAdmin = async (adminData) => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.post('/login/admin', adminData);

    if (response.status === 200) {
      return {
        statusCode: 200,
        message: "로그인 성공",
        data: response.data,
      };
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
