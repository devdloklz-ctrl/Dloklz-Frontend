export interface User {
  id: string;
  username: string;
  email?: string;   // optional now
  phone?: string;   // optional
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
