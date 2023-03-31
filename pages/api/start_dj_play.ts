import type {NextApiRequest, NextApiResponse} from 'next';
import {withIronSessionApiRoute} from "iron-session/next";
import axios from "axios";
import process from "process";

type Data = {
    data: string
}

export default withIronSessionApiRoute(
    async function handler(
        req: NextApiRequest,
        res: NextApiResponse<Data>
    ) {
        const body = req.body;

        if (!body.play_list_id) {
            return res.status(400).json({data: 'PlayListID is not found'})
        }

        const session = req.session;

        if (Object.keys(session).length === 0) {
            return res.status(401).json({data: 'Please login again.'})
        }

        const start_resume_playback_data = {
            start_resume_playback_body: {
                "context_uri": "spotify:playlist:" + body.play_list_id,
                "offset": {
                    "position": 1
                },
                "position_ms": 0
            },
            spotify_token: session.spotify_token
        };

        await axios.post(
            'http://localhost:3000/api/spotify/start_resume_playback',
            start_resume_playback_data
        );

        const skipMusic = async function () {
            await axios.post(
                'http://localhost:3000/api/spotify/skip_to_next',
                {
                    spotify_token: session.spotify_token
                }
            )

        };
        const tm = 120000;
        setInterval(skipMusic, tm);
    },
    {
        cookieName: process.env.IRON_SESSION_OPTION_COOKIE_NAME as string,
        password: process.env.IRON_SESSION_OPTION_PASSWORD as string,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    },
);