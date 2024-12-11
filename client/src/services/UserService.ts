
import RequestHandler from "../utils/RequestHandler";
import {API_ROUTES_USER} from "../utils/api";

export class UserService {
    constructor() {}

    public static async getCampaigns() {
        const response = await RequestHandler.get(API_ROUTES_USER.GET_CAMPAIGNS);
        return response;
    }
}

