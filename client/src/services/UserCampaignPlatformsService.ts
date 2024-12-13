
import RequestHandler from "../utils/RequestHandler";
import {API_ROUTES_USER_CAMPAIGN_PLATFORMS} from "../utils/api";

export class UserCampaignPlatformsService {
    constructor() {}

    public static async getPlatforms() {
        const response = await RequestHandler.get(API_ROUTES_USER_CAMPAIGN_PLATFORMS.PLATFORMS);
        return response;
    }

    public static async delete(_platformId: number) {
        const response = await RequestHandler.post(`${API_ROUTES_USER_CAMPAIGN_PLATFORMS.DELETE}/${_platformId}`, {});
        return response;
    }
}

