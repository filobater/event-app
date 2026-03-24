import { Component } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { LucideAngularModule, CalendarDays } from 'lucide-angular';

@Component({
  selector: 'app-category-donut-chart',
  standalone: true,
  imports: [CanvasJSAngularChartsModule, LucideAngularModule],
  template: `
    <div class="rounded-xl p-4 bg-(--dark-gray-color) border border-(--border-color)">
      <h3 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
        <i-lucide [img]="CalendarIcon" class="size-5 text-(--accent-color) mt-[0.8px]" /> Events by
        Category
      </h3>
      <canvasjs-chart
        [options]="chartOptions"
        [styles]="{ width: '100%', height: '250px' }"
      ></canvasjs-chart>
    </div>
  `,
})
export default class CategoryDonutChartComponent {
  readonly CalendarIcon = CalendarDays;
  chartOptions = {
    animationEnabled: true,
    backgroundColor: 'transparent',
    toolTip: {
      backgroundColor: '#1a1c28',
      borderColor: '#3a3d4d',
      cornerRadius: 6,
      contentFormatter: (e: any) => {
        const dp = e.entries[0]?.dataPoint;
        return `
          <div style="padding: 4px 2px; font-family: sans-serif;">
            <span style="color: ${dp?.color}; font-weight: 600;">${dp?.name}</span>
            <span style="color: #fff; margin-left: 6px;">${dp?.count}</span>
          </div>
        `;
      },
    },
    data: [
      {
        type: 'doughnut',
        innerRadius: '60%',
        indexLabel: '{name} {y}%',
        indexLabelFontSize: 16,
        indexLabelPlacement: 'outside',
        indexLabelLineThickness: 1,
        dataPoints: [
          {
            y: 50,
            name: 'Technology',
            color: '#4285F4',
            indexLabelFontColor: '#4285F4',
            indexLabelLineColor: '#4285F4',
            count: 7,
          },
          {
            y: 21,
            name: 'Marketing',
            color: '#FBBC05',
            indexLabelFontColor: '#FBBC05',
            indexLabelLineColor: '#FBBC05',
            count: 3,
          },
          {
            y: 14,
            name: 'Design',
            color: '#34A853',
            indexLabelFontColor: '#34A853',
            indexLabelLineColor: '#34A853',
            count: 2,
          },
          {
            y: 14,
            name: 'Business',
            color: '#EA4335',
            indexLabelFontColor: '#EA4335',
            indexLabelLineColor: '#EA4335',
            count: 2,
          },
        ],
      },
    ],
  };
}
