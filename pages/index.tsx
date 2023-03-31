import Head from "next/head";
import crypto from "crypto";

// NOTE: ページ上でenvの値を持ってくるためにgetStaticPropsを使う必要がある。
export async function getStaticProps() {
    const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing'];
    const N = 16;
    const state =  crypto.randomBytes(N).toString('base64').substring(0, N);
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID as string);
    params.append('response_type', 'code');
    params.append('redirect_uri', process.env.RETURN_TO as string);
    params.append('scope', scopes.join(' '));
    params.append('state', state);
    return {
        props: { loginPath: `https://accounts.spotify.com/authorize?${params.toString()}` }
    }
}

export default function Index(loginPath: object) {

    const login = () => {
        window.location.href = Object.values(loginPath).toString();
    };

    return (
        <div>
            <Head>
                <title>YouCanDjSkip</title>
                <meta name="description" content="Spotifyで自分のプレイリストを1分おきにスキップしてくれるサイト"/>
            </Head>
            <h1>YouCanDjSkip</h1>
            <div>
            </div>
            <button onClick={login}>
                Sign in with Spotify
            </button>
            <form action="/api/start_dj_play" method="post">
                <label htmlFor="play_list_id">PlayListID</label>
                <input type="text" id="play_list_id" name="play_list_id"/>
                <button type="submit">Start</button>
            </form>
        </div>

    )
}