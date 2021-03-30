// import { Injectable } from '@nestjs/common';
// import { User } from './user.model';
// import { UserService } from './user.service';


// @Injectable()
// export class AuthService {
//   constructor(private userService: UserService) { }

//   async validateUser(username: string, pass: string): Promise<User> {
//     const user = await this.userService.findByName(username);
//     if (user && user.password === pass) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }
// }