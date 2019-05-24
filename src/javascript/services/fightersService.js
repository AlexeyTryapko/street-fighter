import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters() {
    try {
      const endpoint = 'user';
      const apiResult = await callApi(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(_id) {
    try {
      const endpoint = `user/${_id}`;
      const apiResult = await callApi(endpoint, 'GET');
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async updateFighterInfo(data) {
    try {
      const endpoint = `user/${data._id}`;
      const apiResult = await callApi(endpoint, "PUT", data);
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async deleteFighter(_id) {
    try {
      const endpoint = `user/${_id}`;
      const apiResult = await callApi(endpoint, "DELETE");
      return apiResult;
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
