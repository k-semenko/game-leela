import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.sass'],
})
export class LogoutComponent implements OnInit {
  loaderText = 'Пожалуйста подождите!';

  constructor(
    @Inject(AuthenticationService)
    private authenticationService: AuthenticationService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
