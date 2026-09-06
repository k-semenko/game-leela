import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'statistic-ring-chart',
  templateUrl: './ring-chart.component.html',
  styleUrls: ['./ring-chart.component.sass'],
})
export class RingChartComponent {
  index = NaN;

  @Input() title = '';
  @Input() labels: string[] = [];
  @Input() values: number[] = [0, 0, 0];
  @Input() data: any[] = [];
  @Input() actionType: any;

  @Output() action = new EventEmitter();

  runAction = () => {
    if (this.actionType) {
      this.action.emit(this.actionType);
    }
  };

  get sum(): number {
    return Number.isNaN(this.index)
      ? this.data.length
      : this.values[this.index];
  }

  get label(): string {
    return Number.isNaN(this.index) ? this.title : this.labels[this.index];
  }
}
