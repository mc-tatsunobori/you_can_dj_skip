import Head from "next/head";

export default function Index() {
    return (
        <div>
            <Head>
                <title>YouCanDjSkip</title>
                <meta name="description" content="Spotifyで自分のプレイリストを1分おきにスキップしてくれるサイト"/>
            </Head>
            <h1>YouCanDjSkip</h1>
            <form action="/api/form" method="post">
                <label htmlFor="play_list_id">PlayListID</label>
                <input type="text" id="play_list_id" name="play_list_id"/>
                <button type="submit">Start</button>
            </form>
        </div>

    )
}