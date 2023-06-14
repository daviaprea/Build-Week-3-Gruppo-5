import { IRegister } from "./i-register";

export interface IPost {
  id: string;
  title:string;
  bodyText:string;
  createdBy_id:string;
  imageUrl?:string;
  videoUrl?:string;
  postTopic:string;
  likes: {[key: string]: any};
  user: IRegister
}
