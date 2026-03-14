import {
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
  selector: 'app-alert-modal',
  standalone: true,
  templateUrl: './alert-modal.component.html',
})
export default class AlertModalComponent {
  private readonly platformId = inject(PLATFORM_ID);

  title = input.required<string>();
  description = input.required<string>();
  cancelLabel = input<string>('Cancel');
  okLabel = input<string>('OK');
  disabled = input<boolean>(false);
  cancelled = output<void>();
  ok = output<void>();

  isOpen = input<boolean>(false);

  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const open = this.isOpen();
      const dialog = this.dialogRef()?.nativeElement;
      if (!dialog) return;

      if (open) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    });
  }

  protected handleClose(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.dialogRef()?.nativeElement?.close();
    this.cancelled.emit();
  }

  protected handleCancel(): void {
    this.handleClose();
  }

  protected handleOk(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.dialogRef()?.nativeElement?.close();
    this.ok.emit();
  }

  protected handleBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef()?.nativeElement) {
      this.handleClose();
    }
  }
}
