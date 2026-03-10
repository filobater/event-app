import { Component, input } from '@angular/core';
import { SlicePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [SlicePipe, UpperCasePipe],
  templateUrl: './avatar.component.html',
})
export default class AvatarComponent {
  imageUrl = input<string | null | undefined>(null);
  label = input<string>('');

  private imageFailed = false;

  get showImage(): boolean {
    return !!this.imageUrl() && !this.imageFailed;
  }

  onError() {
    this.imageFailed = true;
  }
}

