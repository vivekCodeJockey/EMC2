import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ProgressInfo, StatsProgressBarData } from '../data/stats-progress-bar';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData {
  private progressInfoData: ProgressInfo[] = [
    {
      title: 'Today’s Test',
      value: 572900,
      activeProgress: 70,
      description: 'Better than last week (70%)',
    },
    {
      title: 'New JRF',
      value: 6378,
      activeProgress: 30,
      description: 'Better than last week (30%)',
    },
    {
      title: 'New Report',
      value: 200,
      activeProgress: 55,
      description: 'Better than last week (55%)',
    },
  ];

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return observableOf(this.progressInfoData);
  }
}
