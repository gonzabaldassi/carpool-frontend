export interface User {
  id: number | null;
  username: string;
  name: string| null;
  lastname: string| null;
  dni: string| null;
  email: string| null;
  gender: string| null;
  phone: string| null;
  status?: string| null;
  profileImage?: string| null;
  roles: Array<'user' | 'driver' | null>;
  birthDate: string| null
}
