export class Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  empresa: any;
  foto: string;
  roles: string[] = [];
}