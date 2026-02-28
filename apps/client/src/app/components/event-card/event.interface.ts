export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  totalSeats: number;
  registeredSeats: number;
  status: 'ongoing' | 'upcoming' | 'completed';
  isRegistered: boolean;
  image: string;
}
