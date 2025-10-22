import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('Auto Finance Simulator');

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title());
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Advanced auto finance calculator and simulator for comparing vehicle financing options, taxes, and monthly payments.' 
    });
  }
}
