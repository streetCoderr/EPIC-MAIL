import { ITokenUser, IUser } from "../interface";
export default function generateTokenUser(user: IUser): ITokenUser {
  return {
    userId: String(user._id),
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
  };
}
