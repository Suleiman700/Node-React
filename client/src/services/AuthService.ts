import RequestHandler from "../utils/RequestHandler";
import { API_ROUTES_USER } from "../utils/api";
import { useRouter } from "../routes/hooks"; // Assuming this wraps useNavigate from React Router

export class AuthService {
    constructor() {}

    public static async isLogged() {
        const response = await RequestHandler.get(API_ROUTES_USER.GET_ME);
        return response;
    }
}

export function useKickNonLogged() {
    const router = useRouter(); // Use hook inside a custom hook or component

    const kickNonLogged = async () => {
        try {
            const response = await AuthService.isLogged();
            if (response.status !== 200) {
                router.push('/sign-in');
            }
        }
        catch (error) {
            console.error("Error checking login status:", error);
            router.push('/sign-in'); // Redirect to sign-in on error
        }
    };

    return { kickNonLogged };
}
