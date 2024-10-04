import { getAuthAxios } from '../authAxios';

const RegistrationRequestDetail = async (id, role) => {
    const authAxios = getAuthAxios();
    try {
        const response = await authAxios.get(`/registration`, {
            params: {
                id,
                role
            }
        });

        if (response.status === 200) {
            return {
                statusCode: 200,
                message: "요청이 성공했습니다.",
                data: response.data.data,
            };
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return {
                statusCode: 400,
                message: "조회 실패",
            };
        }
    }
};

export default RegistrationRequestDetail;
