const default_timer = 25;
const timer = process && process.env && process.env.TIMER_PERIOD;

export const environment = {
  production: true,
  timer: (timer && parseInt(timer, 10)) || default_timer,
};

console.log('environment', environment);
