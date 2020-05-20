import { Injectable } from '@angular/core';
import { Voice } from './interface';

const synthesis = window.speechSynthesis;

const duration = 10;

@Injectable({
  providedIn: 'root',
})
export class SpeechApi {
  async getUsVoice() {
    const allVoices: Voice[] = await new Promise(resolve => {
      const id = setInterval(() => {
        const voices = synthesis.getVoices();
        if (voices && voices.length > 0) {
          resolve(voices);
          clearInterval(id);
        }
      }, duration);
    });
    const allEngVoices = allVoices.filter(v => v.lang.startsWith('en-US'));
    return allEngVoices[0];
  }

  speak(minutes: number, seconds: number, voice: Voice) {
    const minuteText = minutes <= 1 ? 'minute' : 'minutes';
    const text = seconds === 0 ? `${minutes} ${minuteText}` : `${minutes} ${minuteText} and ${seconds} seconds`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1;

    synthesis.speak(utter);
  }

  start() {
    if (synthesis.paused) {
      synthesis.resume();
    }
  }

  cancel() {
    if (synthesis.speaking) {
      synthesis.cancel();
    }
  }
}
