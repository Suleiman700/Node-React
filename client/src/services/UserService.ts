
import RequestHandler from "../utils/RequestHandler";
import {API_ROUTES_CAMPAIGNS, API_ROUTES_USER} from "../utils/api";

export class UserService {
    constructor() {}

    public static async getCampaigns() {
        const response = await RequestHandler.get(API_ROUTES_CAMPAIGNS.CAMPAIGNS);
        return response;
    }

    public static async getCampaign(_campaignId: number) {
        const response = await RequestHandler.get(`${API_ROUTES_CAMPAIGNS.CAMPAIGNS}/${_campaignId}`);
        return response;
    }

    public static async getLeads(_params: object = {}) {
        const response = await RequestHandler.get(`${API_ROUTES_USER.GET_LEADS}`, _params);
        return response;
    }
}

