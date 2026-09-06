import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../services/meta.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.sass'],
})
export class PolicyComponent implements OnInit {
  constructor(private readonly meta: MetaService) {}

  ngOnInit() {
    this.meta.updateMetaTags([
      {
        name: 'title',
        content: 'Политика в отношении обработки персональных данных',
      },
    ]);
  }
}
