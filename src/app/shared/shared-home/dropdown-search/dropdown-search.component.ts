import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, inject, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { finalize, Observable, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.css']
})
export class DropdownSearchComponent implements OnInit {

  @Input() valueService!: any;
  @Input() control!: FormControl;
  @Input() errorMsg: string | null = null;
  @Input() label: string = 'Buscar';
  @Input() searchMethod: string = 'searchValues';

  showDropdown = false;
  isLoading = false;

  values: {id:string, name:string}[] = [];

  elementRef = inject(ElementRef)

  filtered$: Observable<any[]> | null = null;

  ngOnInit(): void {
    this.filtered$ = this.control.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        const query = value?.trim() ?? '';

        this.showDropdown = query.length > 3;
        if (!this.showDropdown) return of([]);

        this.isLoading = true;
        return this.searchValues(query).pipe(
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  private searchValues(query: string): Observable<any[]> {
    if (
      !query ||
      !this.valueService ||
      typeof this.valueService[this.searchMethod] !== 'function'
    ) {
      return of([]);
    }

    const result = this.valueService[this.searchMethod](query);
    return result instanceof Observable ? result : of([]);
  }

  onValuesSelected(value: any): void {
    const codeCustomer: string = (value.busqueda || '').split(' - ')[0].trim();  
    this.control.setValue(codeCustomer);
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  onInputFocus() {
    this.showDropdown = true;
  }

}
