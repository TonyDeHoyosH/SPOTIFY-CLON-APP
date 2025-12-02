import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SpotifySearchResponse } from '../../interfaces/spotify-api/spotify-search-response';
import { SearchResults } from '../../interfaces/search-results';
import { Track } from '../../interfaces/track';
import { Artist } from '../../interfaces/artist';
import { Album } from '../../interfaces/album';

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {

  constructor(
    private _http: HttpClient
  ) { }

  search(query: string): Observable<SearchResults> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track,artist,album')
      .set('limit', '5');

    return this._http.get<SpotifySearchResponse>(
      `${environment.API_URL}/search`,
      { params }
    ).pipe(
      map(response => this.mapSearchResponse(response))
    );
  }

  private mapSearchResponse(response: SpotifySearchResponse): SearchResults {
    return {
      tracks: response.tracks?.items.map(item => this.mapTrack(item)) || [],
      artists: response.artists?.items.map(item => this.mapArtist(item)) || [],
      albums: response.albums?.items.map(item => this.mapAlbum(item)) || []
    };
  }

  private mapTrack(item: any): Track {
    return {
      id: item.id,
      name: item.name,
      preview_url: item.preview_url,
      duration_ms: item.duration_ms,
      artists: item.artists?.map((artist: any) => ({
        id: artist.id,
        name: artist.name
      })),
      album: item.album ? {
        id: item.album.id,
        name: item.album.name,
        images: item.album.images
      } : undefined
    };
  }

  private mapArtist(item: any): Artist {
    return {
      id: item.id,
      name: item.name,
      images: item.images,
      followers: item.followers,
      genres: item.genres
    };
  }

  private mapAlbum(item: any): Album {
    return {
      id: item.id,
      name: item.name,
      images: item.images,
      release_date: item.release_date,
      total_tracks: item.total_tracks,
      artists: item.artists?.map((artist: any) => ({
        id: artist.id,
        name: artist.name
      }))
    };
  }
}
