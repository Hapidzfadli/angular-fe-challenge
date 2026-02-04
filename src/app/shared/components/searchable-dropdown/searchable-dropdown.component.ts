import { Component, EventEmitter, Input, Output, ElementRef, HostListener, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface DropdownOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchable-dropdown.component.html',
  styleUrl: './searchable-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdownComponent),
      multi: true
    }
  ]
})
export class SearchableDropdownComponent implements ControlValueAccessor {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder = 'Select an option';
  @Input() disabled = false;

  isOpen = false;
  searchTerm = '';
  selectedOption: DropdownOption | null = null;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  get filteredOptions(): DropdownOption[] {
    if (!this.searchTerm.trim()) {
      return this.options;
    }
    return this.options.filter(option =>
      option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchTerm = '';
      }
    }
  }

  selectOption(option: DropdownOption): void {
    this.selectedOption = option;
    this.isOpen = false;
    this.searchTerm = '';
    this.onChange(option.name);
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      this.selectedOption = this.options.find(o => o.name === value) || null;
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
