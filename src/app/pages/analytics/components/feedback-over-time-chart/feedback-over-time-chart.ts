import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { AnalyticsPeriod } from '../../../../core/models/analytics.model';

@Component({
  selector: 'app-feedback-over-time-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './feedback-over-time-chart.html',
  styleUrl: './feedback-over-time-chart.scss',
})
export class FeedbackOverTimeChart implements OnChanges {
  @Input() data: { date: string; count: number }[] = [];
  @Input() period: AnalyticsPeriod = 'month';
  @Input() loading = false;

  chartData: ChartData<'line'> = { labels: [], datasets: [] };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: items => items[0]?.label ?? '',
          label: ctx => ` ${ctx.parsed.y} feedback`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0 },
        grid: { color: '#f1f5f9' },
      },
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 3, hoverRadius: 5 },
    },
  };

  get isEmpty(): boolean {
    return this.data.every(d => d.count === 0);
  }

  ngOnChanges(): void {
    const labels = this.data.map(d => this.formatLabel(d.date));
    const counts = this.data.map(d => d.count);

    this.chartData = {
      labels,
      datasets: [
        {
          data: counts,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.12)',
          fill: true,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
        },
      ],
    };
  }

  private formatLabel(dateStr: string): string {
    const d = new Date(dateStr);
    if (this.period === 'all') {
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
