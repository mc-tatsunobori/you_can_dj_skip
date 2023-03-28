import type { IronSessionOptions } from "iron-session";
import * as process from "process";


export const sessionOptions: IronSessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: process.env.IRON_SESSION_OPTION_COOKIE_NAME as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

declare module "iron-session" {
    interface IronSessionData {
        spotify_token: {
            "access_token": string
            "refresh_token": string
        }
    }
}
