import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  template: '<app-timer></app-timer>',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular 5'

  constructor(titleService: Title) {
    titleService.setTitle('Pomodoro Timer')
  }
}
