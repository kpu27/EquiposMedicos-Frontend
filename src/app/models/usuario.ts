export class Usuario {
    id: number;
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    email: string;
    empresa: any;
    roles: string[] = [];
  }

  export class UsuarioLogin {


    constructor(username?: string, password?:string){
        this.username = username;
        this.password = password;
    }    


    id?: number;
    username?: string;
    password?: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    empresa?: any;
    roles?: string[] = [];
  }