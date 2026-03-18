import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-loading',
  standalone: true,
  imports: [CommonModule],
  template:
    '<div class="flex justify-center items-center min-h-[50vh]"><span class="loading loading-spinner loading-xl"></span></div>',
})
export default class AdminLoadingComponent {}

