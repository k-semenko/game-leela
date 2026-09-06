import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { CellsInterface } from '../../../interface';
import { Subscription } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { TuiTableFiltersDirective } from '@taiga-ui/addon-table';
import { NotificationTypes } from '../../../constants';

@Component({
  selector: 'admin-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.sass'],
  providers: [TuiTableFiltersDirective],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CellsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  cellsForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    number: new FormControl(0, Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
  cellsData: CellsInterface[] = [];

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(TuiAlertService) private readonly alert: TuiAlertService,
  ) {
    this.subscriptions.push(
      this.httpService.getCellsData().subscribe((data) => {
        this.cellsData = data;
      }),
    );
  }

  readonly filter = (item: number, value: number): boolean =>
    !value ? true : item === value;

  ngOnInit() {
    this.cellsForm.reset();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((i) => {
      i.unsubscribe();
    });
  }

  onSubmit = () => {
    if (this.cellsForm.valid) {
      const contr = this.cellsForm.controls;
      this.subscriptions.push(
        this.httpService
          .updateCellData({
            description: contr.description.value!,
            number: contr.number.value!,
            title: contr.title.value!,
            id: contr.id.value!,
          })
          .subscribe({
            next: (data) => {
              this.cellsData = this.cellsData.map((value) => {
                return value.id === data.id ? data : value;
              });
              this.cellsForm.setValue({
                id: null,
                title: null,
                description: '',
                number: contr.number.value!,
              });
              this.alert
                .open('Данные успешно обновлены!', {
                  appearance: NotificationTypes.Success,
                })
                .subscribe();
            },
            error: (e) => reportError(e),
          }),
      );
    } else {
      this.cellsForm.markAllAsTouched();
      this.alert.open('Форма заполнена не корректно').subscribe();
    }
  };

  editCellData(cell: CellsInterface) {
    this.cellsForm.setValue({
      id: cell.id,
      description: cell.description,
      title: cell.title,
      number: cell.number,
    });

    window.scroll({ top: 0, left: 0, behavior: 'auto' });
  }
}
