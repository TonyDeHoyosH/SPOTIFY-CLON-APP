import { Router } from '@angular/router';

export class AppRouter {
  constructor(private router: Router) {}

  navigateToSearch(searchQuery: string): void {
    this.router.navigate(['/search', searchQuery]);
  }

  navigateToTrack(trackId: string): void {
    this.router.navigate(['/track', trackId]);
  }

  navigateToArtist(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  navigateToAlbum(albumId: string): void {
    this.router.navigate(['/album', albumId]);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
