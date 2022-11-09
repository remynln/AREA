export interface SpotifyTrack {
    id: string,
    title: string,
    link: string,
    duration: string,
    artist: {
        id: string,
        name: string
    },
    album: {
        id: string,
        title: string,
    }
}