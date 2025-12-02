import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LocalTrack } from '../../interfaces/local/local-track';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private endpoint = '/tracks';

  constructor(private apiService: ApiService) {}

  // Crear track
  createTrack(track: LocalTrack): Observable<LocalTrack> {
    return this.apiService.post<LocalTrack>(this.endpoint, track);
  }

  // Obtener track por ID
  getTrack(id: number): Observable<LocalTrack> {
    return this.apiService.get<LocalTrack>(`${this.endpoint}/${id}`);
  }

  // Obtener todos los tracks
  getAllTracks(): Observable<LocalTrack[]> {
    return this.apiService.get<LocalTrack[]>(this.endpoint);
  }

  // Actualizar track
  updateTrack(id: number, track: LocalTrack): Observable<LocalTrack> {
    return this.apiService.put<LocalTrack>(`${this.endpoint}/${id}`, track);
  }

  // Eliminar track
  deleteTrack(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
