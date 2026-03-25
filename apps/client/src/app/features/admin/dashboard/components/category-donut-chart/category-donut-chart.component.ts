import { Component, computed, inject, input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { CountDto } from '@events-app/shared-dtos';
import { LucideAngularModule, CalendarDays } from 'lucide-angular';

const CATEGORY_COLORS: Record<string, string> = {
  technology: '#4285F4',
  marketing: '#FBBC05',
  design: '#34A853',
  business: '#EA4335',
};

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
        [options]="chartOptions()"
        [styles]="{ width: '100%', height: '250px' }"
      ></canvasjs-chart>
    </div>
  `,
})
export default class CategoryDonutChartComponent {
  eventsByCategory = input<CountDto[] | null>();
  readonly CalendarIcon = CalendarDays;

  readonly chartOptions = computed(() => {
    const categories = this.eventsByCategory() ?? [];
    const total = categories.reduce((sum, c) => sum + c.count, 0) || 1;

    const dataPoints = categories.map((cat) => {
      const color = CATEGORY_COLORS[cat._id] ?? '#888';
      const name = cat._id.charAt(0).toUpperCase() + cat._id.slice(1);
      return {
        y: Math.round((cat.count / total) * 100),
        name,
        color,
        indexLabelFontColor: color,
        indexLabelLineColor: color,
        count: cat.count,
      };
    });

    return {
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
          indexLabelFontSize: 15,
          indexLabelPlacement: 'outside',
          indexLabelLineThickness: 1,
          dataPoints,
        },
      ],
    };
  });
}
