import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-rating-distribution-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './rating-distribution-chart.html',
  styleUrl: './rating-distribution-chart.scss',
})
export class RatingDistributionChart implements OnChanges {
  @Input() distribution: Record<string, number> = {};
  @Input() loading = false;

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.parsed.x} responses`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
        grid: { color: '#f1f5f9' },
      },
      y: { grid: { display: false } },
    },
  };

  get isEmpty(): boolean {
    return Object.values(this.distribution).every(v => v === 0);
  }

  ngOnChanges(): void {
    const counts = [1, 2, 3, 4, 5].map(n => this.distribution[String(n)] ?? 0);
    this.chartData = {
      labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
      datasets: [
        {
          data: counts,
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'],
          borderRadius: 4,
          barThickness: 20,
        },
      ],
    };
  }
}
