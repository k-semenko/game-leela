import { SwaggerUIBundle } from 'swagger-ui-dist';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'admin-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.sass'],
})
export class ApiComponent implements OnInit {
  items = [
    {
      caption: 'AdminPage',
      routerLink: '/admin',
    },
    {
      caption: 'OpenAPI',
      routerLink: '/admin/api',
    },
  ];

  ngOnInit() {
    if (!environment.production) {
      SwaggerUIBundle({
        url: 'api/swagger',
        dom_id: '#swagger-ui',
        deepLinking: false,
        docExpansion: 'none',
        layout: 'BaseLayout',
        requestInterceptor: (request: any) => {
          // JWT is httpOnly cookie; ensure browser sends it.
          request.credentials = 'include';
          return request;
        },
      });
    }
  }
}
