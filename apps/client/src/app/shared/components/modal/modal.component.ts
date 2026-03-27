import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
})
export default class ModalComponent {
  private readonly platformId = inject(PLATFORM_ID);

  title = input.required<string>();
  isOpen = input<boolean>(false);

  onClose = input<() => void>();
  class = input<string>('');

  closed = output<void>();

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const open = this.isOpen();
      const dialog = this.dialogRef()?.nativeElement;
      if (!dialog) return;

      if (open) {
        dialog.show();
      } else {
        dialog.close();
      }
    });
  }

  protected handleClose(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.dialogRef()?.nativeElement?.close();
    this.onClose()?.();
    this.closed.emit();
  }
}
