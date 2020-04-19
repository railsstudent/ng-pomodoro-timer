import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

const timerMessages = {
  start: 'Let the countdown begin!!',
  running: 'Greatness is within sight!!',
  stop: 'Never quit keep going!!',
};

enum Status {
  STOP = 'STOP',
  PAUSE = 'PAUSE',
  RUNNING = 'RUNNING',
}

const TWENTY_FIVE = environment.timer;
const NUM_SECONDS = 60;
const TOTAL_SECONDS = TWENTY_FIVE * NUM_SECONDS;
const TEN = 10;
const MILLISECONDS_INTERVAL = 1000;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, OnDestroy {
  message = '';
  strMinutes = '';
  strSeconds = '';
  totalSeconds: number = TOTAL_SECONDS;
  timerId: any;
  status = Status.STOP;
  volumeOnSub$ = new Subject<string>();
  volumeOn = '';
  unsubscribe$ = new Subject();
  speechSupported = 'speechSynthesis' in window;

  constructor() {}

  ngOnInit() {
    this.message = timerMessages.start;
    this.displayTime();

    this.volumeOnSub$.pipe(startWith('off'), takeUntil(this.unsubscribe$)).subscribe(value => (this.volumeOn = value));
  }

  countdown() {
    this.timerId = setInterval(() => {
      if (this.totalSeconds <= 0) {
        clearInterval(this.timerId);
        this.setStatus(Status.STOP);
        this.displayTime();
      }
      this.displayTime();
      this.totalSeconds -= 1;
    }, MILLISECONDS_INTERVAL);
  }

  displayTime() {
    const seconds = this.totalSeconds % NUM_SECONDS;
    const minutes = Math.floor((this.totalSeconds - seconds) / NUM_SECONDS);

    this.strMinutes = `${minutes < TEN ? '0' : ''}${minutes}`;
    this.strSeconds = `${seconds < TEN ? '0' : ''}${seconds}`;
  }

  startTimer() {
    this.setStatus(Status.RUNNING);
    this.countdown();
  }

  pauseTimer() {
    clearInterval(this.timerId);
    this.setStatus(Status.PAUSE);
  }

  stopTimer() {
    clearInterval(this.timerId);
    this.setStatus(Status.STOP);
    this.displayTime();
  }

  setStatus(newStatus: Status) {
    this.status = newStatus;
    switch (newStatus) {
      case Status.STOP:
        this.message = timerMessages.start;
        this.totalSeconds = TOTAL_SECONDS;
        break;
      case Status.RUNNING:
        this.message = timerMessages.running;
        break;
      case Status.PAUSE:
        this.message = timerMessages.stop;
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
