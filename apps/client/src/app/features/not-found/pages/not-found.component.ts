import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, MapPinOffIcon } from 'lucide-angular';
import { NAV } from 'src/app/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './not-found.component.html',
})
export default class NotFoundComponent {
  readonly MapPinOffIcon = MapPinOffIcon;
  readonly NAV = NAV;
}
