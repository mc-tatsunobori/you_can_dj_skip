import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as process from "process";

type ResponseBody = {
    null: any
}

// TODO: resを受け付けるべきかどうか&ResponseBodyの定義が不要かどうか調査。
export default async function skipToNext (res: NextApiResponse) {
    try {
        const config = {
            method: 'post',
            url: 'https://api.spotify.com/v1/me/player/next',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.SPOTIFY_AUTH_TOKEN
            }
        };

        axios(config)
            .then(function (response: { data: ResponseBody; }) {
                res.status(204).json("success");
            })
            .catch(function (error: any) {
                res.status(401).json(error)
            });

    } catch (error: any) {
        res.status(500).send(error.message);
    }
}