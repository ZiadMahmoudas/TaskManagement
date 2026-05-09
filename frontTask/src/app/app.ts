import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar";
import { FooterComponent } from "./layout/footer/footer";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 showLayout = true;

  // الصفحات اللي مش عايز فيها navbar وfooter
  private hiddenRoutes = ['/login', '/register'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showLayout = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}
