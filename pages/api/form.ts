import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as process from "process";
import * as console from "console";
import startResumePlayback from "@/pages/api/spotify/start_resume_playback";
import skipToNext from "@/pages/api/spotify/skip_to_next";

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

    const data = {
        "context_uri": "spotify:playlist:" + body.play_list_id,
        "offset": {
            "position": 1
        },
        "position_ms": 0
    };

    startResumePlayback(data, res).then(r => {
        // TODO: rを使用していないので、記述処理を変更予定。
        console.log(r);
        const skipMusic = function () {
            // TODO: 非同期処理として裏側で処理し続けるようにする。
            skipToNext(res).then(r => {
                // TODO: rを使用していないので、記述処理を変更予定。
                console.log(r);
            });

        };
        const tm = 120000;
        setInterval(skipMusic,tm);
    });
}