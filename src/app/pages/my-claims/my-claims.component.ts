import { Component, inject } from '@angular/core';
import { RequestService } from '../../core/core-admin/services-admin/request/request.service';
import { AuthService } from '../../core/core-admin/services-admin/auth/auth.service';
import { CaseRequestFull } from '../../core/core-admin/models-admin/case-request-full';
import { Page } from '../../core/core-admin/models-admin/pageable.model';
import { PaginationComponent } from '../../shared/shared-home/components-home/pagination/pagination.component';
import { CardComponent } from '../../shared/shared-home/components-home/card/card.component';
import { NgClass, NgFor, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-my-claims',
  standalone: true,
  imports: [PaginationComponent, CardComponent, NgFor, NgClass, SlicePipe],
  templateUrl: './my-claims.component.html',
  styleUrl: './my-claims.component.css'
})
export class MyClaimsComponent {

  selectedCase!: CaseRequestFull;
  isModalOpen = false;

  requestService = inject(RequestService);
  authService = inject(AuthService);

  pageable: Page<CaseRequestFull> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 9,
    number: 0
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.requestService.getAllByCustomer( this.pageable.number, this.pageable.size, this.authService.userCode).subscribe(data => {
        this.pageable = data;
    });
  }

  onPageChange(page: number) {
    this.pageable.number = page;
    this.loadData();
  }

  onReload() {
    this.pageable.number = 0;
    this.loadData();
  }

  openClaimDetail(request: CaseRequestFull) {
    this.selectedCase = request;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
