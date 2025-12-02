import { Image } from "./image";
import { Track } from "./track";

export interface Album {
    id: string,
    name: string,
    total_tracks: number,
    href?: string,
    release_date?: string,
    images?: Image[],
    tracks?: Track[],
    artists?: {
        id: string,
        name: string
    }[]
}
