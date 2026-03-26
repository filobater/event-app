import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-account-info-skeleton',
  standalone: true,
  templateUrl: './account-info-skeleton.component.html',
})
export default class AccountInfoSkeletonComponent {}

