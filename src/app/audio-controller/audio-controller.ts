import { Component, ElementRef, ViewChild, AfterViewInit, input, output, effect } from '@angular/core';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements AfterViewInit {
  @ViewChild('audioElement', { static: false }) audioElement!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef<HTMLInputElement>;

  // Inputs para recibir la cola y el índice actual
  currentQueue = input<Track[]>([]);
  currentTrackIndex = input<number>(0);

  // Outputs para comunicar cambios de canción
  previousTrack = output<void>();
  nextTrack = output<void>();

  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor() {
    // Effect para detectar cambios en el track actual
    effect(() => {
      const queue = this.currentQueue();
      const index = this.currentTrackIndex();
      
      if (queue.length > 0 && queue[index]) {
        this.loadTrack(queue[index]);
      }
    });
  }

  ngAfterViewInit(): void {
    const audio = this.audioElement.nativeElement;
    const progressBar = this.progressBar.nativeElement;

    // Inicializar barra de progreso en 0
    progressBar.value = '0';

    // Actualizar duración cuando se carguen los metadatos
    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration;
      progressBar.max = String(audio.duration);
    });

    // Actualizar barra de progreso mientras se reproduce
    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      progressBar.value = String(audio.currentTime);
    });

    // Resetear cuando termina la canción
    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      progressBar.value = '0';
      this.currentTime = 0;
    });
  }

  togglePlayPause(): void {
    const audio = this.audioElement.nativeElement;
    
    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
    } else {
      audio.play();
      this.isPlaying = true;
    }
  }

  onProgressBarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const audio = this.audioElement.nativeElement;
    audio.currentTime = Number(input.value);
    this.currentTime = audio.currentTime;
  }

  skipForward(): void {
    // Avanzar a la siguiente canción
    this.nextTrack.emit();
  }

  skipBackward(): void {
    // Retroceder a la canción anterior
    this.previousTrack.emit();
  }

  loadTrack(track: Track): void {
    if (!this.audioElement) return;
    
    const audio = this.audioElement.nativeElement;
    const wasPlaying = this.isPlaying;
    
    // Cargar la nueva URL del audio
    audio.src = track.preview_url || '';
    audio.load();
    
    // Si estaba reproduciendo, continuar reproduciendo
    if (wasPlaying && track.preview_url) {
      audio.play();
    }
  }
}
