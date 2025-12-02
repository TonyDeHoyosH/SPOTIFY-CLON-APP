import { Component, input, output } from '@angular/core';
import { SearchResults as SearchResultsData } from '../interfaces/search-results';
import { Track } from '../interfaces/track';
import { Artist } from '../interfaces/artist';
import { Album } from '../interfaces/album';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResultsComponent {
  results = input.required<SearchResultsData>();
  
  trackClick = output<Track>();
  artistClick = output<Artist>();
  albumClick = output<Album>();
  
  onTrackClick(track: Track): void {
    this.trackClick.emit(track);
  }
  
  onArtistClick(artist: Artist): void {
    this.artistClick.emit(artist);
  }
  
  onAlbumClick(album: Album): void {
    this.albumClick.emit(album);
  }

  truncateTitle(title: string, maxLength: number = 20): string {
    if (!title) {
      return '';
    }
    if (title.length <= maxLength) {
      return title;
    }
    return title.substring(0, maxLength).trim() + '...';
  }
}
