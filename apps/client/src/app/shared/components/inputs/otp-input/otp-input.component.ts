import {
  Component,
  ElementRef,
  viewChild,
  signal,
  computed,
  output,
  input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
  templateUrl: './otp-input.component.html',
})
export default class OtpInputComponent implements ControlValueAccessor {
  length = input<number>(6);
  completed = output<string>();

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('otpInput');

  private readonly value = signal('');
  readonly isFocused = signal(false);
  protected isDisabled = signal(false);

  readonly digits = computed(() => {
    const val = this.value();
    return Array.from({ length: this.length() }, (_, i) => val[i] ?? '');
  });

  readonly cursorIndex = computed(() =>
    Math.min(this.value().length, this.length() - 1)
  );

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  focus() {
    this.inputRef()?.nativeElement.focus();
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');

    if (val.length > this.length()) {
      val = val.slice(0, this.length());
    }

    this.value.set(val);
    this.onChange(val);

    if (val.length === this.length()) {
      this.completed.emit(val);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.value.update((v) => v.slice(0, -1));
      this.onChange(this.value());
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') ?? '';
    const clean = paste.replace(/\D/g, '').slice(0, this.length());
    this.value.set(clean);
    this.onChange(clean);

    if (clean.length === this.length()) {
      this.completed.emit(clean);
    }
  }
}
