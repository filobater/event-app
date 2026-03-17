import { Component, computed, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  ImageUploadComponent,
  NumberInputComponent,
  PrimaryButtonComponent,
  ErrorMessageComponent,
  SelectInputComponent,
  SecondaryButtonComponent,
  TextareaComponent,
  TextInputComponent,
  DatetimeInputComponent,
} from 'src/app/shared/components';
import {
  CreateEventRequestDto,
  EventDto,
  SpeakerDto,
  UpdateEventRequestDto,
} from '@events-app/shared-dtos';
import { RequestStateClass } from 'src/app/core/request-state';
import { getDirtyFields } from 'src/app/shared/utils/get-dirty-fields.utils';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    TextInputComponent,
    TextareaComponent,
    NumberInputComponent,
    PrimaryButtonComponent,
    ErrorMessageComponent,
    ImageUploadComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    SecondaryButtonComponent,
    DatetimeInputComponent,
  ],
  templateUrl: './event-form.component.html',
})
export default class EventFormComponent {
  private fb = inject(FormBuilder);
  requestState = input<RequestStateClass>();
  event = input<EventDto | null>(null);
  isEdit = computed(() => !!this.event());
  closed = output<void>();
  onSave = output<CreateEventRequestDto | UpdateEventRequestDto>();

  readonly categoryOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
  ];

  readonly statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
  ];

  eventForm = this.fb.nonNullable.group({
    photo: [null as any, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    category: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    dateTime: ['', [Validators.required]],
    totalSeats: [10, [Validators.required, Validators.min(10)]],
    price: [0, [Validators.required, Validators.min(0)]],
    location: ['', [Validators.required, Validators.minLength(10)]],
    status: ['' as 'ongoing' | 'upcoming' | 'completed' | '', [Validators.required]],
    registeredSeats: [0],
    speakers: this.fb.array(
      [
        this.fb.group({
          name: ['', [Validators.required, Validators.minLength(3)]],
          title: ['', [Validators.required, Validators.minLength(3)]],
          image: [null as any, [Validators.required]],
        }),
      ],
      [Validators.required, Validators.maxLength(2)],
    ),
  });

  constructor() {
    effect(() => {
      if (this.isEdit()) {
        const event = this.event();
        if (!event) return;

        this.eventForm.patchValue(event);
      }
    });
  }

  get formData() {
    return {
      photo: this.eventForm.get('photo'),
      title: this.eventForm.get('title'),
      category: this.eventForm.get('category'),
      description: this.eventForm.get('description'),
      dateTime: this.eventForm.get('dateTime'),
      totalSeats: this.eventForm.get('totalSeats'),
      status: this.eventForm.get('status'),
      price: this.eventForm.get('price'),
      location: this.eventForm.get('location'),
      // registeredSeats: this.eventForm.get('registeredSeats'),
      speakers: this.eventForm.get('speakers') as FormArray,
    };
  }

  getSpeakerGroup(index: number): FormGroup {
    return this.formData.speakers?.at(index) as FormGroup;
  }

  handleAddSpeaker() {
    if (this.formData.speakers?.length >= 2) return;
    this.formData.speakers?.push(
      this.fb.group({
        name: [''],
        title: [''],
        image: [null as any],
      }),
    );
  }

  handleRemoveSpeaker(index: number) {
    if (this.formData.speakers?.length <= 1) return;
    this.formData.speakers?.removeAt(index);
  }

  handleCancel() {
    this.eventForm.reset();
    this.closed.emit();
  }

  handleSpeakerData() {
    return {
      speakerImages: this.formData.speakers
        ?.getRawValue()
        .map((speaker: SpeakerDto) => speaker.image),
      speakers: this.formData.speakers?.getRawValue().map((speaker: SpeakerDto) => ({
        name: speaker.name,
        title: speaker.title,
      })),
    };
  }

  handleSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    if (this.isEdit()) {
      const dirtyFields = getDirtyFields(this.eventForm);

      // TODO: fix this any
      this.onSave.emit({ ...dirtyFields, _id: this.event()?._id } as any);
    } else {
      // this.onSave.emit(this.eventForm.value as any);
      console.log(this.handleSpeakerData());
    }
  }
}
