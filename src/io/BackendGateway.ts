import { WebUtils } from "utils/WebUtils";

export class BackendGateway {
    public static GetCurrentRooms(): Promise<any> {
        return WebUtils.MakeGetRequest("http://localhost:3001/rooms")
            .then((res) => {
                if (res.rooms) {
                    return res.rooms;
                }
                return null;
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
