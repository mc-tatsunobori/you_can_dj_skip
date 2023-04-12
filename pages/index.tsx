import Head from 'next/head';
import crypto from 'crypto';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';

type IndexProps = {
    loginPath: string;
    token: { spotify_token?: { access_token: string } } | null;
};

const createLoginButton = (
    authorized: boolean,
    loginPath: string,
    onClick: () => void,
) => (
    <button
        onClick={authorized ? undefined : onClick}
        className={`rounded-md m-5 p-2 ${
            authorized ? 'bg-gray-500' : 'bg-emerald-500 hover:bg-emerald-600'
        }`}
        disabled={authorized}
    >
        <p className="text-white">Sign in with Spotify</p>
    </button>
);

export const getServerSideProps: GetServerSideProps<IndexProps> = withIronSessionSsr(
    async ({ req }) => {
        const session = req.session;

        const scopes = [
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',
        ];
        const N = 16;
        const state = crypto
            .randomBytes(N)
            .toString('base64')
            .substring(0, N);
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID as string);
        params.append('response_type', 'code');
        params.append('redirect_uri', process.env.RETURN_TO as string);
        params.append('scope', scopes.join(' '));
        params.append('state', state);
        return {
            props: {
                loginPath: `https://accounts.spotify.com/authorize?${params.toString()}`,
                token: session,
            },
        };
    },
    {
        cookieName: process.env.IRON_SESSION_OPTION_COOKIE_NAME as string,
        password: process.env.IRON_SESSION_OPTION_PASSWORD as string,
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        },
    },
);

const Index = ({ loginPath, token }: IndexProps) => {
    const login = () => {
        window.location.href = loginPath;
    };

    const authorized = token?.spotify_token?.access_token;

    return (
        <div>
            <Head>
                <title>YouCanDjSkip</title>
                <meta
                    name="description"
                    content="Spotifyで自分のプレイリストを1分おきにスキップしてくれるサイト"
                />
            </Head>
            <h1 className="text-5xl m-5 flex justify-center">YouCanDJSkip</h1>
            <div className="flex justify-center flex-col max-w-2xl m-auto">
                <div className="m-auto">{createLoginButton(Boolean(authorized), loginPath, login)}</div>
                {authorized && (
                    <div className="m-auto flex justify-center flex-col w-4/5">
                        <form
                            action="/api/start_dj_play"
                            method="post"
                            className="m-5 flex justify-center flex-col"
                        >
                            <label htmlFor="play_list_url">PlayListURL</label>
                            <input
                                type="text"
                                id="play_list_url"
                                name="play_list_url"
                                className="form-input m-2 rounded-md"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-emerald-500 hover:bg-emerald-600 p-2 m-2"
                            >
                                <p className="text-white">Start</p>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Index;

