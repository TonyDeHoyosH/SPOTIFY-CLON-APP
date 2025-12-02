import { Track } from "./track";
import { Artist } from "./artist";
import { Album } from "./album";

export interface SearchResults {
    tracks?: Track[];
    artists?: Artist[];
    albums?: Album[];
}
