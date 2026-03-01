import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html',
})
export default class ImageUploadComponent {
  label = input<string>('Upload image');
  image = signal<{
    previewUrl: string;
    file: File | null;
  }>({
    previewUrl: '',
    file: null,
  });

  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.image.set({ previewUrl: URL.createObjectURL(file), file });
    }
  }

  removeImage() {
    if (this.image().previewUrl) {
      URL.revokeObjectURL(this.image().previewUrl);
    }
    this.image.set({ previewUrl: '', file: null });
  }
}
