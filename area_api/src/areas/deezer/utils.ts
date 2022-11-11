import axios, { AxiosResponse } from "axios";



export async function getPlaylistTracks(playlistId: number, token: string) {
    var res: AxiosResponse = await axios.get(`https://api.deezer.com/playlist/${playlistId}/tracks`,{
        headers: {
            "Authorization": "Bearer" + token
        }
    })
    while (res.data.next) {
        res = await axios.get(res.data.next, {
            headers: {
                "Authorization": "Bearer" + token
            }
        })
    }
}