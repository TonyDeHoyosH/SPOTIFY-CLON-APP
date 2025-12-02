import { Image } from "./image";

export interface Artist {
    id: string;
    name: string;
    images?: Image[];
    followers?: {
        total: number;
    };
    genres?: string[];
}
