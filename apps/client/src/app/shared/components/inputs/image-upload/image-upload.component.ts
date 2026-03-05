import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
  ],
  templateUrl: './image-upload.component.html',
})
export default class ImageUploadComponent implements ControlValueAccessor {
  label = input<string>('Upload image');

  image = signal<{ previewUrl: string; file: File | null }>({
    previewUrl: '',
    file: null,
  });
  protected isDisabled = signal(false);

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(file: File | null): void {
    if (file) {
      this.image.set({ previewUrl: URL.createObjectURL(file), file });
    } else {
      this.image.set({ previewUrl: '', file: null });
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (file) {
      this.image.set({ previewUrl: URL.createObjectURL(file), file });
      this.onChange(file);
      this.onTouched();
    }
  }

  removeImage() {
    if (this.image().previewUrl) {
      URL.revokeObjectURL(this.image().previewUrl);
    }
    this.image.set({ previewUrl: '', file: null });
    this.onChange(null);
    this.onTouched();
  }
}
