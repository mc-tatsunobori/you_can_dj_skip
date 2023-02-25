import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as process from "process";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

type RequestBody = {
    context_uri: string,
    offset: {
        position: number
    },
    position_ms: number
}

type ResponseBody = {
    null: any
}

// TODO: resを受け付けるべきかどうか&ResponseBodyの定義が不要かどうか調査。
export default async function startResumePlayback (data: RequestBody, res: NextApiResponse) {
    try {
        const jsonData = JSON.stringify(data);
        const config = {
            method: 'put',
            url: 'https://api.spotify.com/v1/me/player/play',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.SPOTIFY_AUTH_TOKEN
            },
            data: jsonData
        };

        axios(config)
            .then(function (response: { data: ResponseBody; }) {
                res.status(200).json(response.data);
            })
            .catch(function (error: any) {
                res.status(401).json(error)
            });

    } catch (error: any) {
        res.status(500).send(error.message);
    }
}