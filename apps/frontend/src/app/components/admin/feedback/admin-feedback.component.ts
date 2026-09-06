import { Component, Input, OnInit } from '@angular/core';
import { TuiTablePaginationEvent } from '@taiga-ui/addon-table';
import {
  FeedbackInterface,
  UpdateFeedbackInterface,
} from '../../base/help/help.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { NotificationTypes } from '../../../constants';
import { TuiAlertService } from '@taiga-ui/core';

@Component({
  selector: 'admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./feedback.component.sass'],
})
export class AdminFeedbackComponent implements OnInit {
  @Input() data: FeedbackInterface[] = [];

  pageSize = 10;
  currentPage = 0;
  totalItems = 0;

  feedback: FeedbackInterface[] = [];
  selectedFeedback: FeedbackInterface | null = null;
  showDialog: boolean = false;

  feedbackForm = new FormGroup({
    id: new FormControl(0, [Validators.required]),
    comment: new FormControl(''),
    active: new FormControl(true, [Validators.required]),
  });

  constructor(
    private readonly httpService: HttpService,
    private readonly alert: TuiAlertService,
  ) {}

  ngOnInit() {
    this.totalItems = this.data.length;
    this.feedback = this.getFilteredData();
  }

  changePage = (paginator: TuiTablePaginationEvent) => {
    this.currentPage = paginator.page;
    this.pageSize = paginator.size;
    this.feedback = this.getFilteredData();
  };
  getFilteredData = () => {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.data.filter((user, index) => index >= start && index < end);
  };

  openDialog = (feedbackId: number) => {
    this.selectedFeedback = this.feedback.find((f) => (f.id = feedbackId))!;
    this.feedbackForm.patchValue({
      id: this.selectedFeedback.id,
      comment: this.selectedFeedback.comment,
      active: this.selectedFeedback.active,
    });
    this.showDialog = true;
  };

  onSubmit = () => {
    if (this.feedbackForm.valid) {
      const controls = this.feedbackForm.controls;

      const feedbackData: UpdateFeedbackInterface = {
        id: Number(controls.id.value),
        comment: String(controls.comment.value),
        active: Boolean(controls.active.value),
      };

      this.httpService.updateFeedback(feedbackData).subscribe({
        next: (data: any) => {
          this.alert
            .open(data.message, {
              appearance: NotificationTypes.Success,
            })
            .subscribe();

          this.feedback = this.feedback.map((f) => {
            if (f.id === this.selectedFeedback?.id) {
              f.comment = feedbackData.comment;
              f.active = feedbackData.active;
              return f;
            }

            return f;
          });

          this.feedbackForm.reset();
          this.feedbackForm.markAsUntouched();
          this.selectedFeedback = null;
          this.showDialog = false;
        },
      });
    }
  };
}
