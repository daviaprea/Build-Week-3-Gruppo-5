import { IRegister } from "./i-register";

export interface Icomment {
  id?: string;
  createdBy: IRegister;
  body: string;
  post_id: string;
  commentDate:string;
}
