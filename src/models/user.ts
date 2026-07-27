import { Role } from "./role";

export interface User {
  id: number;
  email: string;
  name: string;
  roleId: number;
  createdAt: string;
  role: {
    name: Role;
  };
}
