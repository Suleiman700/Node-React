import RequestHandler from "../utils/RequestHandler";
import {API_ROUTES_LEAD} from "../utils/api";

export class LeadService {
    constructor() {}

    public static async delete(_id: number) {
        const response = await RequestHandler.post(`${API_ROUTES_LEAD.DELETE}/${_id}`, {});
        return response;
    }
}
