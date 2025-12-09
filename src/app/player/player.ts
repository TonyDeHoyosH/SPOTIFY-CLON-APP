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
    this.album$ = this._spotifyAlbum.getAlbum('4aawyAB9vmqN3uQ7FjRGTy')
    this.appRouter = new AppRouter(this.router);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const query = params['query'];
      
      if (query) {
        // Si hay un parámetro de búsqueda en la URL
        this.searchQuery = query;
        this.showSearchResults = true;
        this.searchResults$ = this._spotifySearch.search(query);
      } else if (id) {
        const path = this.route.snapshot.url[0]?.path;
        if (path === 'album') {
          this.loadAlbum(id);
        }
      }
    });
  }

  loadAlbum(albumId: string): void {
    this.showSearchResults = false;
    this.searchResults$ = null;
    this.selectedTrack = null;
    this.album$ = this._spotifyAlbum.getAlbum(albumId);
    
    // Suscribirse para actualizar el queue con las canciones del álbum
    this.album$.subscribe(album => {
      this.currentQueue = album.tracks || [];
      this.currentCover = album.images?.at(0);
      this.currentTrackIndex = 0;
      if (this.currentQueue.length > 0) {
        this.selectedTrack = this.currentQueue[0];
      }
    });
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchQuery.trim()) {
      this.showSearchResults = true;
      this.searchResults$ = this._spotifySearch.search(this.searchQuery);
      // Actualizar la URL con el término de búsqueda
      this.appRouter.navigateToSearch(this.searchQuery);
    }
  }

  clearSearch(): void {
    this.showSearchResults = false;
    this.searchQuery = '';
    this.searchResults$ = null;
  }

  // Métodos de navegación para elementos clickeados
  onTrackClick(track: Track): void {
    this.selectedTrack = track;
    this.showSearchResults = false;
    this.searchResults$ = null;
    
    // Poner solo esta canción en el queue
    this.currentQueue = [track];
    this.currentCover = track.album?.images?.at(0);
    this.currentTrackIndex = 0;
    
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

  // Métodos para navegar entre canciones
  onPreviousTrack(): void {
    if (this.currentQueue.length === 0) return;
    
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.currentQueue.length) % this.currentQueue.length;
    this.selectedTrack = this.currentQueue[this.currentTrackIndex];
    this.currentCover = this.selectedTrack.album?.images?.at(0);
  }

  onNextTrack(): void {
    if (this.currentQueue.length === 0) return;
    
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentQueue.length;
    this.selectedTrack = this.currentQueue[this.currentTrackIndex];
    this.currentCover = this.selectedTrack.album?.images?.at(0);
  }

}