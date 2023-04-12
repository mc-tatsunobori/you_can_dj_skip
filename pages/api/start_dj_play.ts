import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import axios from 'axios';

type Data = {
    data: string;
};

type SpotifyToken = {
    access_token: string;
    refresh_token: string;
};

const PLAYLIST_URL_REGEX =
    /https:\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)\?si\=[a-zA-Z0-9]+/;
const INTERVAL_TIME = 120000;

const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        // server-side
        return process.env.NEXT_PUBLIC_BASE_URL as string;
    } else {
        // client-side
        return window.location.origin;
    }
};

async function startResumePlayback(playlistId: string, spotifyToken: SpotifyToken) {
    const data = {
        start_resume_playback_body: {
            context_uri: 'spotify:playlist:' + playlistId,
            offset: {
                position: 1,
            },
            position_ms: 0,
        },
        spotify_token: spotifyToken.access_token,
    };

    await axios.post(`${getBaseUrl()}/api/spotify/start_resume_playback`, data);
}

async function skipToNext(spotifyToken: SpotifyToken) {
    await axios.post(`${getBaseUrl()}/api/spotify/skip_to_next`, {
        spotify_token: spotifyToken.access_token,
    });
}

export default withIronSessionApiRoute(
    async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
        const { play_list_url } = req.body;

        if (!play_list_url) {
            return res.status(400).json({ data: 'PlayListURL is not found' });
        }

        const session = req.session;

        if (Object.keys(session).length === 0) {
            return res.status(401).json({ data: 'Please login again.' });
        }

        const match = PLAYLIST_URL_REGEX.exec(play_list_url);

        if (!match) {
            return res.status(400).json({ data: 'PlayListURL is not correct' });
        }

        const playlistId = match[1];
        const spotifyToken: SpotifyToken = session.spotify_token;

        await startResumePlayback(playlistId, spotifyToken);
        setInterval(() => skipToNext(spotifyToken), INTERVAL_TIME);
    },
    {
        cookieName: process.env.IRON_SESSION_OPTION_COOKIE_NAME as string,
        password: process.env.IRON_SESSION_OPTION_PASSWORD as string,
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        },
    },
);
