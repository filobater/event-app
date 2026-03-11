import { Component, input } from '@angular/core';
import { SlicePipe, UpperCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [SlicePipe, UpperCasePipe],
  templateUrl: './avatar.component.html',
})
export default class AvatarComponent {
  readonly baseUrl = environment.apiUrl;
  imageUrl = input<string | null | undefined>(null);
  label = input<string>('');
  class = input<string>('');
  private imageFailed = false;

  get showImage(): boolean {
    return !!this.imageUrl() && !this.imageFailed;
  }
  
  constructor() {
    console.log(this.baseUrl + '/' + this.imageUrl());
  }

  onError() {
    this.imageFailed = true;
  }
}

