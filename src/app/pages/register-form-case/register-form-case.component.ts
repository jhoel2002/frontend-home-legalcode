import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../core/core-admin/services-admin/alert/alert.service';
import { RequestService } from '../../core/core-admin/services-admin/request/request.service';
import { DropdownSearchComponent } from '../../shared/shared-home/dropdown-search/dropdown-search.component';
import { CustomerService } from '../../core/core-admin/services-admin/customer/customer.service';
import { AuthService } from '../../core/core-admin/services-admin/auth/auth.service';
import { ThisReceiver } from '@angular/compiler';
import { BuffetService } from '../../core/core-admin/services-admin/buffet/buffet.service';

@Component({
  selector: 'app-register-form-case',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgIf, NgFor],
  templateUrl: './register-form-case.component.html',
  styleUrls: ['./register-form-case.component.css']
})
export class RegisterFormCaseComponent {

  caseTypes: string[] = [];

  form!: FormGroup;

  fb = inject(FormBuilder);
  alertService = inject(AlertService);
  requestService = inject(RequestService);
  authService = inject(AuthService);
  buffetService = inject(BuffetService);

  uploadError: string | null = null;

  createForm():void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type_case: ['', Validators.required],
      evidences: [null],
    });
  }

  resetFormState(): void {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  close() {
    this.resetFormState();
  }
  ngOnInit() {
    this.createForm();
    this.buffetService.getTypeCasesByCode(this.authService.userBuffet).subscribe({
      next: (types: string[]) => {
        this.caseTypes = types;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = { ...this.form.value };
    const codeCustomer: string = this.authService.userCode;
    this.requestService.register(codeCustomer, payload).subscribe({
      next: () => {
        this.alertService.success({ message: "Solicitud de caso enviado exitosamente" }).then(() => {
          this.close();
        });
      },
      error: (error: any) => {
        this.alertService.error({ message: error });
      }
    });
  }

  onEvidencesSelected(event: any): void {
    const evidences:File []= Array.from(event.target.files);
    if (!document) return; 
    this.form.patchValue(
      { 
        evidences: evidences
      }
    );
    this.uploadError = null;
  }

  get title() { 
    return this.form.get('title'); 
  }

  get description() { 
    return this.form.get('description'); 
  }

  get type_case() { 
    return this.form.get('type_case'); 
  }

  // get customer(): FormControl { 
  //   return this.form.get('customer') as FormControl; 
  // }
}
