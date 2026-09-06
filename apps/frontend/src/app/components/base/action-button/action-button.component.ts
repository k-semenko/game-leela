import { Component, Input } from '@angular/core';

@Component({
  selector: 'action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.sass'],
})
export class ActionButtonComponent {
  @Input() header: string = '';
  @Input() description: string | null = null;
  @Input() icon: string = '@tui.thumbs-up';
  @Input() routerLink: string | null = null;
  @Input() type: string = 'neutral';
  @Input() size: number = 24;
  @Input() hideText: boolean = false;
}
