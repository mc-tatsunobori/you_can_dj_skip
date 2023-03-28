import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {withIronSessionApiRoute} from "iron-session/next";
import * as process from "process";

type SpotifyAuthApiResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    refresh_token: string
}

export default withIronSessionApiRoute(
    async function authorize(req: NextApiRequest, res: NextApiResponse) {
        const {code, state} = req.query;

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code as string);
        params.append('redirect_uri', process.env.RETURN_TO as string);
        params.append('sate', state as string);

        const response = await axios.post<SpotifyAuthApiResponse>(
            'https://accounts.spotify.com/api/token',
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString('base64')}`
                }
            }
        );

        //  TODO:リファレンスとライブラリの中身を見た感じtokenやuserは見当たらないが、sessionの中身はsaveかdestroyしかいないので謎。
        req.session.spotify_token = {
            "access_token": response.data.access_token,
            "refresh_token": response.data.refresh_token
        };
        await req.session.save();

        res.status(200).redirect('/');
    },
    {
        cookieName: process.env.IRON_SESSION_OPTION_COOKIE_NAME as string,
        password: process.env.IRON_SESSION_OPTION_PASSWORD as string,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    },
);