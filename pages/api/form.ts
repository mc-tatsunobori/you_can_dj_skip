import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as process from "process";
import * as console from "console";

type Data = {
    data: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    let i;
// Get data submitted in request's body.
    const body = req.body

    if (!body.play_list_id) {
        // Sends a HTTP bad request error code
        return res.status(400).json({ data: 'PlayListID is not found' })
    }

    const data = JSON.stringify({
        "context_uri": "spotify:playlist:" + body.play_list_id,
        "offset": {
            "position": 1
        },
        "position_ms": 0
    });

    const config = {
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.SPOTIFY_AUTH_TOKEN
        },
        data: data
    };

    // TODO: この後ページを元のページに返す。
    axios(config)
        .then(function (response: { data: any; }) {
            res.status(200).json(response.data);
        })
        .catch(function (error: any) {
            res.status(401).json(error)
        });

    // TODO: 上記再生処理と分割。
    const skipMusic = function () {
        const config = {
            method: 'post',
            url: 'https://api.spotify.com/v1/me/player/next',
            headers: {
                'Authorization': 'Bearer ' + process.env.SPOTIFY_AUTH_TOKEN
            }
        };

        axios(config)
            .then(function (response: { data: any; }) {
                res.status(200).json(response.data);
            })
            .catch(function (error: any) {
                res.status(401).json(error)
            });
    };
    const tm = 120000;
    setInterval(skipMusic,tm);
}