
import RequestHandler from "../utils/RequestHandler";
import {API_ROUTES_CAMPAIGNS} from "../utils/api";

export class CampaignService {
    constructor() {}

    public static async edit(_id: number, _campaign: object) {
        const response = await RequestHandler.post(`${API_ROUTES_CAMPAIGNS.EDIT}/${_id}`, _campaign);
        return response;
    }
}

