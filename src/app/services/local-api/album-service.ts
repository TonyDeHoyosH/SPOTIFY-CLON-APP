import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { LocalAlbum } from '../../interfaces/local/local-album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private endpoint = '/albumes';

  constructor(private apiService: ApiService) {}

  // Crear álbum
  createAlbum(album: LocalAlbum): Observable<LocalAlbum> {
    return this.apiService.post<LocalAlbum>(this.endpoint, album);
  }

  // Obtener álbum por ID
  getAlbum(id: number): Observable<LocalAlbum> {
    return this.apiService.get<LocalAlbum>(`${this.endpoint}/${id}`);
  }

  // Obtener todos los álbumes
  getAllAlbums(): Observable<LocalAlbum[]> {
    return this.apiService.get<LocalAlbum[]>(this.endpoint);
  }

  // Actualizar álbum
  updateAlbum(id: number, album: LocalAlbum): Observable<LocalAlbum> {
    return this.apiService.put<LocalAlbum>(`${this.endpoint}/${id}`, album);
  }

  // Eliminar álbum
  deleteAlbum(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
}
