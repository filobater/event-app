import { Component, computed, input } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { TopEventByRegistrationDto } from '@events-app/shared-dtos';
import { LucideAngularModule, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-registration-bar-chart',
  standalone: true,
  imports: [CanvasJSAngularChartsModule, LucideAngularModule],
  template: `
    <div class="rounded-xl p-4 bg-(--dark-gray-color) border border-(--border-color)">
      <h3 class="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
        <i-lucide [img]="TrendingUpIcon" class="size-5 text-(--main-color)" /> Top Events by
        Registration
      </h3>
      <div class="h-[250px] px-6">
        <canvasjs-chart
          [options]="chartOptions()"
          [styles]="{ width: '100%', height: '100%' }"
        ></canvasjs-chart>
      </div>
    </div>
  `,
})
export default class RegistrationBarChartComponent {
  topEventsByRegistration = input<TopEventByRegistrationDto[] | null>();
  readonly TrendingUpIcon = TrendingUp;

  private truncate(text: string, max = 16): string {
    return text.length > max ? text.slice(0, max) + '..' : text;
  }

  readonly chartOptions = computed(() => {
    const events = this.topEventsByRegistration() ?? [];

    const registeredPoints = events.map((item) => ({
      label: this.truncate(item.event.title),
      y: item.event.registeredSeats,
    }));

    const availablePoints = events.map((item) => ({
      label: this.truncate(item.event.title),
      y: item.event.totalSeats - item.event.registeredSeats,
    }));

    return {
      animationEnabled: true,
      backgroundColor: 'transparent',
      axisX: {
        labelFontColor: '#7b879d',
        labelFontSize: 11,
        lineColor: '#3a3d4d',
        tickColor: '#3a3d4d',
      },
      axisY: {
        labelFontColor: '#7b879d',
        labelFontSize: 11,
        gridColor: '#2a2d3d',
        lineColor: '#3a3d4d',
        tickColor: '#3a3d4d',
      },
      toolTip: {
        shared: true,
        backgroundColor: '#1a1c28',
        borderColor: '#3a3d4d',
        cornerRadius: 6,
        contentFormatter: (e: any) => {
          const label = e.entries[0]?.dataPoint?.label ?? '';
          const registered = e.entries[0]?.dataPoint?.y ?? 0;
          const available = e.entries[1]?.dataPoint?.y ?? 0;
          return `
            <div style="padding: 4px 2px; font-family: sans-serif;">
              <div style="color: #fff; font-weight: 600; margin-bottom: 6px;">${label}</div>
              <div style="color: #1f8fff; font-size: 13px;">Registered : ${registered}</div>
              <div style="color: #fff; font-size: 13px;">Available : ${available}</div>
            </div>
          `;
        },
      },
      data: [
        { type: 'column', name: 'Registered', color: '#1f8fff', dataPoints: registeredPoints },
        { type: 'column', name: 'Available', color: '#fff', dataPoints: availablePoints },
      ],
    };
  });
}
