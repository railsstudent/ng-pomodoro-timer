import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { startWith, takeUntil, map, tap } from 'rxjs/operators'
import { SpeechApi } from './speech.service'
import { Voice } from './interface'
import {
  TOTAL_SECONDS,
  NUM_SECONDS,
  TEN,
  MILLISECONDS_INTERVAL,
  SPEAK_INTERVAL,
  timerMessages,
  Status,
} from './constants'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, OnDestroy {
  message = ''
  strMinutes = ''
  strSeconds = ''
  totalSeconds: number = TOTAL_SECONDS
  timerId: any
  status = Status.STOP
  volumeOnSub$ = new Subject<string>()
  volumeOn = ''
  unsubscribe$ = new Subject()
  speechSupported = 'speechSynthesis' in window
  voice: Voice

  constructor(private speechApi: SpeechApi) {}

  ngOnInit() {
    this.message = timerMessages.start
    this.displayTime()

    this.speechApi.getUsVoice().then((voice) => (this.voice = voice))

    this.volumeOnSub$
      .pipe(
        startWith('off'),
        map((value) => (this.status !== Status.RUNNING ? this.volumeOn || value : value)),
        tap((value) => console.log('volumnOn', value)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((value) => (this.volumeOn = value))
  }

  countdown() {
    this.timerId = setInterval(() => {
      if (this.totalSeconds <= 0) {
        clearInterval(this.timerId)
        this.setStatus(Status.STOP)
        this.displayTime()
      }
      this.displayTime()
      this.totalSeconds -= 1
    }, MILLISECONDS_INTERVAL)
  }

  displayTime() {
    const seconds = this.totalSeconds % NUM_SECONDS
    const minutes = Math.floor((this.totalSeconds - seconds) / NUM_SECONDS)

    this.strMinutes = `${minutes < TEN ? '0' : ''}${minutes}`
    this.strSeconds = `${seconds < TEN ? '0' : ''}${seconds}`

    if (this.volumeOn === 'on' && SPEAK_INTERVAL.indexOf(seconds) >= 0) {
      this.speechApi.speak(minutes, seconds, this.voice)
    }
  }

  startTimer() {
    this.setStatus(Status.RUNNING)
    this.countdown()
  }

  pauseTimer() {
    clearInterval(this.timerId)
    this.setStatus(Status.PAUSE)
    this.volumeOnSub$.next('off')
  }

  stopTimer() {
    clearInterval(this.timerId)
    this.setStatus(Status.STOP)
    this.volumeOnSub$.next('off')
    this.displayTime()
  }

  setStatus(newStatus: Status) {
    this.status = newStatus
    switch (newStatus) {
      case Status.STOP:
        this.message = timerMessages.start
        this.totalSeconds = TOTAL_SECONDS
        break
      case Status.RUNNING:
        this.message = timerMessages.running
        break
      case Status.PAUSE:
        this.message = timerMessages.stop
        break
      default:
        break
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
