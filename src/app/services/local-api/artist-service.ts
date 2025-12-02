import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LocalArtist } from '../../interfaces/local/local-artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private endpoint = '/artistas';

  constructor(private apiService: ApiService) {}

  // Crear artista
  createArtist(artist: LocalArtist): Observable<LocalArtist> {
    return this.apiService.post<LocalArtist>(this.endpoint, artist);
  }

  // Obtener artista por ID
  getArtist(id: number): Observable<LocalArtist> {
    return this.apiService.get<LocalArtist>(`${this.endpoint}/${id}`);
  }

  // Obtener todos los artistas
  getAllArtists(): Observable<LocalArtist[]> {
    return this.apiService.get<LocalArtist[]>(this.endpoint);
  }

  // Actualizar artista
  updateArtist(id: number, artist: LocalArtist): Observable<LocalArtist> {
    return this.apiService.put<LocalArtist>(`${this.endpoint}/${id}`, artist);
  }

  // Eliminar artista
  deleteArtist(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
