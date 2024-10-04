import { getAuthAxios } from '../authAxios';

const RegistrationDecision = async (id, role, decision) => {
    const authAxios = getAuthAxios();
    try {
        const response = await authAxios.put(`/registration`, null, {
            params: {
                id,
                role
            },
            data: {
                decision
            }
        });

        if (response.status === 200) {
            return {
                statusCode: 200,
                message: "승인/거절 성공",
            };
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return {
                statusCode: 400,
                message: "승인/거절 실패",
            };
        }
    }
};

export default RegistrationDecision;
