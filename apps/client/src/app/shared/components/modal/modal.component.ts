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
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
})
export default class ModalComponent {
  private readonly platformId = inject(PLATFORM_ID);

  title = input.required<string>();
  isOpen = input<boolean>(false);

  closed = output<void>();

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
    this.closed.emit();
  }

  protected handleBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogRef()?.nativeElement) {
      this.handleClose();
    }
  }
}
