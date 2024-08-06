import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentDateTime$: Observable<Date>;
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor() {
    this.currentDateTime$ = interval(1000).pipe(
      map(() => new Date())
    );
  }

  addNewItem(value: boolean) {
    this.newItemEvent.emit(value);
  }
}
