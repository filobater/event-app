import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SlicePipe, UpperCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-avatar',
  standalone: true,
  imports: [SlicePipe, UpperCasePipe],
  templateUrl: './avatar.component.html',
})
export default class AvatarComponent {
  readonly baseUrl = environment.apiUrl;
  private imageFailed = false;
  imageUrl = input<string | null | undefined | File>(null);
  label = input<string>('');
  class = input<string>('');

  get showImage(): boolean {
    return !!this.imageUrl() && !this.imageFailed;
  }

  onError() {
    this.imageFailed = true;
  }
}
