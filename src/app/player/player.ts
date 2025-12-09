import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { SpotifySearchService } from '../services/spotify-api/spotify-search-service';
import { AppRouter } from '../services/general/app-router';
import { Album } from '../interfaces/album';
import { SearchResults } from '../interfaces/search-results';
import { Track } from '../interfaces/track';
import { Artist } from '../interfaces/artist';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit{

  album$: Observable<Album>
  searchResults$: Observable<SearchResults> | null = null;
  showSearchResults = false;
  searchQuery = '';
  selectedTrack: Track | null = null;
  selectedArtist: Artist | null = null;
  currentQueue: Track[] = [];
  currentCover: any = null;
  currentTrackIndex: number = 0;
  appRouter: AppRouter;

  constructor(
    private _spotifyAlbum: SpotifyAlbumService,
    private _spotifySearch: SpotifySearchService,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.album$ = new Observable<Album>();
    this.appRouter = new AppRouter(this.router);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const query = params['query'];
      
      if (query) {
        this.searchQuery = query;
        this.showSearchResults = true;
        this.searchResults$ = this._spotifySearch.search(query);
      } else if (id) {
        const path = this.route.snapshot.url[0]?.path;
        if (path === 'album') {
          this.loadAlbum(id);
        } else if (path === 'track') {
          this.loadTrackById(id);
        }
      } else {
        this.loadAlbum('63YUyakTLOBCWBab1oEtxe');
      }
    });
  }

  loadAlbum(albumId: string, selectFirstTrack: boolean = true): void {
    this.showSearchResults = false;
    this.searchResults$ = null;
    this.album$ = this._spotifyAlbum.getAlbum(albumId);
    
    this.album$.subscribe(album => {
      this.currentQueue = album.tracks || [];
      this.currentCover = album.images?.at(0);
      
      if (selectFirstTrack) {
        this.currentTrackIndex = 0;
        if (this.currentQueue.length > 0) {
          this.selectedTrack = this.currentQueue[0];
        }
      }
    });
  }

  loadTrackById(trackId: string): void {
    if (this.selectedTrack && this.selectedTrack.id === trackId) {
      return;
    }
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchQuery.trim()) {
      this.showSearchResults = true;
      this.searchResults$ = this._spotifySearch.search(this.searchQuery);
      this.appRouter.navigateToSearch(this.searchQuery);
    }
  }

  clearSearch(): void {
    this.showSearchResults = false;
    this.searchQuery = '';
    this.searchResults$ = null;
  }

  onTrackClick(track: Track): void {
    this.showSearchResults = false;
    this.searchResults$ = null;
    
    
    if (track.album?.id) {
      this.album$ = this._spotifyAlbum.getAlbum(track.album.id);
      this.album$.subscribe(album => {
        this.currentQueue = album.tracks || [];
        this.currentCover = album.images?.at(0);
        const trackIndex = album.tracks?.findIndex(t => t.id === track.id);
        if (trackIndex !== undefined && trackIndex !== -1) {
          this.currentTrackIndex = trackIndex;
          this.selectedTrack = this.currentQueue[trackIndex];
        } else {
          this.currentQueue = [track, ...this.currentQueue];
          this.currentTrackIndex = 0;
          this.selectedTrack = track;
        }
      });
    } else {
      this.selectedTrack = track;
      this.currentQueue = [track];
      this.currentCover = track.album?.images?.at(0);
      this.currentTrackIndex = 0;
    }
    
    this.appRouter.navigateToTrack(track.id);
  }

  onArtistClick(artist: Artist): void {
    this.selectedArtist = artist;
    this.showSearchResults = false;
    this.searchResults$ = null;
    this.appRouter.navigateToArtist(artist.id);
  }

  onAlbumClick(album: Album): void {
    this.showSearchResults = false;
    this.searchResults$ = null;
    this.loadAlbum(album.id);
    this.appRouter.navigateToAlbum(album.id);
  }

  onPreviousTrack(): void {
    if (this.currentQueue.length === 0) return;
    
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.currentQueue.length) % this.currentQueue.length;
    this.selectedTrack = this.currentQueue[this.currentTrackIndex];
  }

  onNextTrack(): void {
    if (this.currentQueue.length === 0) return;
    
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentQueue.length;
    this.selectedTrack = this.currentQueue[this.currentTrackIndex];
  }

}