import apiClient from "../apiClient";

const signupHospital = async (hospitalData) => {
  try {
    const response = await apiClient.post('/signup/hospital', hospitalData);

    return {
      status : response.status,
      body : response.data
    };

  } catch (error) {
    console.error(error);
    console.log(error.response.status);

    if(error.response.status === 409) {
      alert('이미 존재하는 사용자입니다.')

      return {
        status : error.response.status,

      }
    }


  }
};

export default signupHospital;
