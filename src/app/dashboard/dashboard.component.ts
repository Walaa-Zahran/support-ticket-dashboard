import { TicketRequest } from './../model/tickets.interface';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TicketBySupportRep } from '../model/dataSourceRep.interface';
import { ChartDataPoint } from '../model/chart.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  data: any;
  displayedColumns: string[] = ['supportRep', 'openTickets'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<TicketBySupportRep>([]);
  ticketsBySupportRep: Array<{ rep: string; openTickets: number }> = [];
  chartOptions: any;
  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.fetchData();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.initializeChartData();
  }

  fetchData() {
    this.http.get('/assets/data.json').subscribe((data) => {
      this.data = data;
      this.calculateTicketsBySupportRep();
      this.dataSource.data = this.ticketsBySupportRep;
    });
  }
  initializeChartData() {
    this.chartOptions = {
      animationEnabled: true,
      theme: 'dark2',
      exportEnabled: true,
      title: {
        text: 'Tickets',
      },
      data: [
        {
          type: 'pie',
          indexLabel: '{label}: {y}',
          dataPoints: [
            { y: 3, label: 'Team A' },
            { y: 5, label: 'Team B' },
          ],
        },
      ],
      options: {
        responsive: true,
      },
    };
  }
  //Cards
  get openTicketsCount() {
    return this.data.requests.filter(
      (request: TicketRequest) => request.status === 'Open'
    ).length;
  }

  get unassignedTicketsCount() {
    return this.data.requests.filter(
      (request: TicketRequest) =>
        request.status === 'Open' && !request.supportRep
    ).length;
  }

  get highPriorityOpenTicketsCount() {
    return this.data.requests.filter(
      (request: TicketRequest) =>
        request.status === 'Open' && request.priority === 'High'
    ).length;
  }

  get openChangeRequestsCount() {
    return this.data.requests.filter(
      (request: TicketRequest) =>
        request.status === 'Open' && request.type === 'Change Request'
    ).length;
  }
  //Table
  calculateTicketsBySupportRep() {
    const reps = new Map<string, number>();

    this.data.requests.forEach((request: TicketRequest) => {
      if (request.status === 'Open') {
        const rep = request.supportRep || 'Unassigned';
        reps.set(rep, (reps.get(rep) || 0) + 1);
      }
    });
    this.ticketsBySupportRep = Array.from(reps.entries()).map(
      ([rep, count]) => ({ rep, openTickets: count })
    );
    this.ticketsBySupportRep.sort((a, b) => b.openTickets - a.openTickets);
  }
}
