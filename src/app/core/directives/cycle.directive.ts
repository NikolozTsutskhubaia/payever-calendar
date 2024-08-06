import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface CycleContext {
  $implicit: string;
}
@Directive({
  selector: '[appCycle]',
  standalone: true
})
export class CycleDirective {
  @Input() set appCycle(count: number) {
    this.viewContainer.clear();
    const startHour = 9;
    const endHour = 23;
    const interval = 1;

    for (let hour = startHour; hour <= endHour; hour += interval) {
      const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: formattedHour
      });
    }
  }

  constructor(private templateRef: TemplateRef<CycleContext>, private viewContainer: ViewContainerRef) { }
}
