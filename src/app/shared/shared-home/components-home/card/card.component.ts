import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CaseRequestFull } from '../../../../core/core-admin/models-admin/case-request-full';
import { FileCardComponent } from '../file-card/file-card.component';
import { DocumentService } from '../../../../core/core-admin/services-admin/document/document.service';
import { AlertService } from '../../../../core/core-admin/services-admin/alert/alert.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FileCardComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Output() closeModal = new EventEmitter<void>();

  @Input() request!: CaseRequestFull;
  @Input() isOpen = false;

  close() {
    this.closeModal.emit();
  }

  documentService = inject(DocumentService);
  alertService = inject(AlertService)
  
  downloadFileByCode(cotizacion: any) {
    this.documentService.downloadFileByCode(cotizacion.code).subscribe({
      next: (doc) => {
        if (!doc) {
          this.alertService.error({ message: 'El archivo no fue encontrado.' });
          return;
        }
        const url = URL.createObjectURL(doc);
        const a = document.createElement('a');
        a.href = url;
        a.download = cotizacion.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.alertService.error({ message: error });
      },
    });
  }

}
