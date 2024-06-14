import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  stats = [
    { title: 'Open Tickets', value: 10 },
    { title: 'Unassigned Tickets', value: 5 },
    { title: 'High Priority Open Tickets', value: 3 },
    { title: 'Open Change Requests', value: 7 },
  ];
  dataSource = [
    { supportRep: 'Support Rep 1', openTickets: 4 },
    { supportRep: 'Support Rep 2', openTickets: 2 },
    { supportRep: 'Support Rep 3', openTickets: 1 },
  ];
  displayedColumns: string[] = ['supportRep'];
  chartOptions = {
    animationEnabled: true,
    theme: 'dark2',
    exportEnabled: true,
    title: {
      text: 'Open Tickets by Team',
    },
    subtitles: [
      {
        text: 'Number of Tickets',
      },
    ],
    data: [
      {
        type: 'pie',
        indexLabel: '{name}: {y}',
        dataPoints: [
          { name: 'Team A', y: 15 },
          { name: 'Team B', y: 12 },
          { name: 'Team C', y: 18 },
        ],
      },
    ],
  };
  constructor(private http: HttpClient) {}
  fetchData() {
    this.http.get('https://example.com/data.json').subscribe((data) => {
      console.log(data);
    });
  }
}
