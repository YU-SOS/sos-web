import getAuthAxios from "../authAxios";

const dupCheckAPI = async (id, role) => {
  try {
    const authAxios = getAuthAxios();
    const response = await authAxios.get(`/dup-check`, {
      params: {
        id,
        role,
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return { status: 409 };
    }
    throw error;
  }
};

export default dupCheckAPI;
