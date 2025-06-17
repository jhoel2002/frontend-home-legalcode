import { DataUser } from "./data-user.model";

export interface AuthResponse {
  token: string;
  username: String;
  role: string;
  buffet: string;
  codeCustomer: string;
}
