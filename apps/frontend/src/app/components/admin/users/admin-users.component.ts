import { Component, Input, OnInit } from '@angular/core';
import { UserProfileInterface, UserRole } from '../../../interface';
import { TuiTablePagination, TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { NotificationTypes } from '../../../constants';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./users.component.sass'],
})
export class AdminUsersComponent implements OnInit {
  @Input() data: UserProfileInterface[] = [];
  users: UserProfileInterface[] = [];
  items: string[] = ['ADMIN', 'USER', 'CURATOR'];

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  showUpdateUserDialog: boolean = false;

  updateUserForm = new FormGroup({
    id: new FormControl(0, [Validators.required]),
    email: new FormControl('', [Validators.email]),
    firstName: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    lastName: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    role: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly httpService: HttpService,
    private readonly alert: TuiAlertService,
  ) {}

  ngOnInit() {
    this.totalItems = this.data.length;
    this.users = this.getFilteredUsers();
  }

  showDialog = (userId: number) => {
    this.showUpdateUserDialog = true;
    const user = this.data.find((u) => u.id === userId);

    this.updateUserForm.patchValue({
      id: user?.id,
      email: user?.email ?? null,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      role: user?.role,
    });
  };

  onSubmit = () => {
    if (this.updateUserForm.valid) {
      const ctr = this.updateUserForm.controls;
      const userData: UserProfileInterface = {
        id: Number(ctr.id.value),
        role: ctr.role.value as UserRole,
        firstName: ctr.firstName.value ?? null,
        lastName: ctr.lastName.value ?? null,
        email: ctr.email.value ?? null,
      };

      this.httpService.updateUserData(userData).subscribe({
        next: (value) => {
          this.alert
            .open(value.message, { appearance: NotificationTypes.Success })
            .subscribe();

          this.data = this.data.map((u) => {
            if (u.id === userData.id) {
              userData['username'] = u.username;
              return userData;
            }

            return u;
          });

          this.users = this.users.map((u) => {
            return u.id === userData.id ? userData : u;
          });

          this.updateUserForm.reset();
          this.updateUserForm.markAsUntouched();
          this.showUpdateUserDialog = false;
        },
      });
    } else {
      this.updateUserForm.markAllAsTouched();
      this.alert
        .open('Форма заполнена не корректно', {
          appearance: NotificationTypes.Error,
        })
        .subscribe();
    }
  };

  changePage = (paginator: TuiTablePaginationEvent) => {
    this.currentPage = paginator.page;
    this.pageSize = paginator.size;
    this.users = this.getFilteredUsers();
  };
  getFilteredUsers = () => {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.data.filter((user, index) => index >= start && index < end);
  };
}
