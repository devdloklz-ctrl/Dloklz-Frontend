import { User } from "@/types/auth";

export const hasRole = (user: User | null, roles: string[]) => {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
};
