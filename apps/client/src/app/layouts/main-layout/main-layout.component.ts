import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {}
