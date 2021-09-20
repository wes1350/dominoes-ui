export class WebUtils {
    public static MakeGetRequest(url: string): Promise<any> {
        return fetch(url, {
            method: "GET",
            // cache: "no-store",
            mode: "cors",
            credentials: "include"
        })
            .then((res) => {
                console.log(res);
                // console.log(res.json());
                return res.json();
            })
            .catch((err) => {
                console.log(err);
                return { error: err.message };
            });
    }

    // public static MakeGetRequest(url: string): Promise<any> {
    //     return fetch(url).catch((err) => {
    //         console.log(err);
    //         return { error: err.message };
    //     });
    // }
}
