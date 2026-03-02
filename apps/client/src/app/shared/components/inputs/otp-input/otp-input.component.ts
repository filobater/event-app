import { Component, ElementRef, viewChild, signal, computed, output, input } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  templateUrl: './otp-input.component.html',
})
export default class OtpInputComponent {
  length = input<number>(6);
  completed = output<string>();

  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('otpInput');

  private readonly value = signal('');
  readonly isFocused = signal(false);

  readonly digits = computed(() => {
    const val = this.value();
    return Array.from({ length: this.length() }, (_, i) => val[i] ?? '');
  });

  readonly cursorIndex = computed(() =>
    Math.min(this.value().length, this.length() - 1)
  );

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

    if (val.length === this.length()) {
      this.completed.emit(val);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.value.update((v) => v.slice(0, -1));
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') ?? '';
    const clean = paste.replace(/\D/g, '').slice(0, this.length());
    this.value.set(clean);

    if (clean.length === this.length()) {
      this.completed.emit(clean);
    }
  }
}
