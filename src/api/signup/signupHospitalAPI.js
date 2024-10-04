import { getAuthAxios } from '../authAxios';

const signupHospital = async (hospitalData) => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.post('/signup/hospital', hospitalData);

    if (response.status === 201) {
      return {
        statusCode: 201,
        message: "회원가입 성공",
      };
    }
  } catch (error) {
    if (error.response.status === 409) {
      return {
        statusCode: 409,
        message: "회원가입 실패",
      };
    } else if (error.response.status === 403) {
      return {
        statusCode: 403,
        message: "인자 에러",
      };
    }
  }
};

export default signupHospital;
