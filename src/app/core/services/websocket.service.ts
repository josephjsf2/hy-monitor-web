import { Injectable, inject, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';
import { AuthService } from './auth.service';
import { StatusUpdateMessage } from '../models/website.model';

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private authService = inject(AuthService);
  private rxStomp: RxStomp | null = null;
  private statusUpdates$ = new Subject<StatusUpdateMessage>();

  connect(): void {
    if (this.rxStomp) return;

    const token = this.authService.getToken();
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: `ws://${window.location.host}/ws`,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
    });

    this.rxStomp.activate();

    this.rxStomp.watch('/topic/status').subscribe(message => {
      const update: StatusUpdateMessage = JSON.parse(message.body);
      this.statusUpdates$.next(update);
    });
  }

  getStatusUpdates(): Observable<StatusUpdateMessage> {
    return this.statusUpdates$.asObservable();
  }

  disconnect(): void {
    if (this.rxStomp) {
      this.rxStomp.deactivate();
      this.rxStomp = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
