import { environment } from 'src/environments/environment';

export const TWENTY_FIVE = environment.timer;
export const NUM_SECONDS = 60;
export const TOTAL_SECONDS = TWENTY_FIVE * NUM_SECONDS;
export const TEN = 10;
export const MILLISECONDS_INTERVAL = 1000;
export const SPEAK_INTERVAL = [0, 15, 30, 45];

export const timerMessages = {
  start: 'Let the countdown begin!!',
  running: 'Greatness is within sight!!',
  stop: 'Never quit keep going!!',
};

export enum Status {
  STOP = 'STOP',
  PAUSE = 'PAUSE',
  RUNNING = 'RUNNING',
}
