import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import * as console from "console";

type SpotifyAuthApiResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    refresh_token: string
}

export default async function authorize(req: NextApiRequest, res: NextApiResponse){
    const { code, state } = req.query;

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

    // TODO:Cookieにトークンを保存する処理を追加
    console.log(response);

    res.status(200).redirect('/');

}