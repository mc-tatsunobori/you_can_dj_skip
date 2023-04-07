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
            <h1 className={"text-5xl m-5 flex justify-center"}>YouCanDJSkip</h1>
            <div>
            </div>
            <div className={"flex justify-center flex-col max-w-2xl m-auto"}>
                <div className={"m-auto"}>
                    <button onClick={login} className={"rounded-md m-5 bg-emerald-500 hover:bg-emerald-600 p-2"}>
                        <p className={"text-white"}>Sign in with Spotify</p>
                    </button>
                </div>
                <div className={"m-auto flex justify-center flex-col"}>
                    <form action="/api/start_dj_play" method="post" className={"m-5 flex justify-center flex-col"}>
                        <label htmlFor="play_list_id">PlayListID</label>
                        <input type="text" id="play_list_id" name="play_list_id" className={"form-input m-2 rounded-md"}/>
                        <button type="submit" className={"rounded-md bg-emerald-500 hover:bg-emerald-600 p-2 m-2"}>
                            <p className={"text-white"}>Start</p>
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
}