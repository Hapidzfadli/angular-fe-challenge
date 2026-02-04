import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  private months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  transform(value: Date | string | null | undefined, format: 'short' | 'long' = 'long'): string {
    if (!value) {
      return '-';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '-';
    }

    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();

    if (format === 'short') {
      return `${day}/${date.getMonth() + 1}/${year}`;
    }

    return `${day} ${month} ${year}`;
  }
}
