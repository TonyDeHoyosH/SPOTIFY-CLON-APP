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
        // Si hay un parámetro de búsqueda en la URL
        this.searchQuery = query;
        this.showSearchResults = true;
        this.searchResults$ = this._spotifySearch.search(query);
      } else if (id) {
        const path = this.route.snapshot.url[0]?.path;
        if (path === 'album') {
          this.loadAlbum(id);
        } else if (path === 'track') {
          // Si es un track individual, cargar su información
          this.loadTrackById(id);
        }
      } else {
        // Cargar álbum por defecto al inicio
        this.loadAlbum('63YUyakTLOBCWBab1oEtxe');
      }
    });
  }

  loadAlbum(albumId: string, selectFirstTrack: boolean = true): void {
    this.showSearchResults = false;
    this.searchResults$ = null;
    this.album$ = this._spotifyAlbum.getAlbum(albumId);
    
    // Suscribirse para actualizar el queue con las canciones del álbum
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
    // Mantener el track seleccionado si ya existe y coincide
    if (this.selectedTrack && this.selectedTrack.id === trackId) {
      return;
    }
    // Si el track no está en el queue actual, necesitaría un servicio
    // para obtener la información del track individual
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
    this.showSearchResults = false;
    this.searchResults$ = null;
    
    // Si el track tiene álbum, cargar todo el álbum para tener el queue completo
    if (track.album?.id) {
      this.album$ = this._spotifyAlbum.getAlbum(track.album.id);
      // Encontrar el índice del track seleccionado en el álbum
      this.album$.subscribe(album => {
        this.currentQueue = album.tracks || [];
        this.currentCover = album.images?.at(0);
        const trackIndex = album.tracks?.findIndex(t => t.id === track.id);
        if (trackIndex !== undefined && trackIndex !== -1) {
          this.currentTrackIndex = trackIndex;
          this.selectedTrack = this.currentQueue[trackIndex];
        } else {
          // Si no se encuentra el track en el álbum, agregarlo al inicio
          this.currentQueue = [track, ...this.currentQueue];
          this.currentTrackIndex = 0;
          this.selectedTrack = track;
        }
      });
    } else {
      // Si no tiene álbum, poner solo esta canción en el queue
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

  // Métodos para navegar entre canciones
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