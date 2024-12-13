import RequestHandler from "../utils/RequestHandler";
import {API_ROUTES_CAMPAIGNS} from "../utils/api";

export class CampaignService {
    constructor() {}

    public static async create(_campaign: object) {
        const response = await RequestHandler.post(`${API_ROUTES_CAMPAIGNS.CREATE}`, _campaign);
        return response;
    }

    public static async edit(_id: number, _campaign: object) {
        const response = await RequestHandler.post(`${API_ROUTES_CAMPAIGNS.EDIT}/${_id}`, _campaign);
        return response;
    }

    public static async delete(_id: number) {
        const response = await RequestHandler.post(`${API_ROUTES_CAMPAIGNS.DELETE}/${_id}`, {});
        return response;
    }
}
