import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { withIronSessionApiRoute } from "iron-session/next";

type ResponseBody = {
    null: any
}

async function startResumePlayback(req: NextApiRequest, res: NextApiResponse) {
    try {
        const config = {
            method: 'put',
            url: 'https://api.spotify.com/v1/me/player/play',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.body.spotify_token}`
            },
            data: req.body.start_resume_playback_body
        };

        await axios(config)
            .then(() => {
                res.status(204).end();
            })
            .catch((error: any) => {
                res.status(401).json(error);
            });

    } catch (error: any) {
        res.status(500).send(error.message);
    }
}

export default withIronSessionApiRoute(startResumePlayback, {
    cookieName: process.env.IRON_SESSION_OPTION_COOKIE_NAME as string,
    password: process.env.IRON_SESSION_OPTION_PASSWORD as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});
