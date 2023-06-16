import { IRegister } from "./i-register";
import { Icomment } from "./icomment";

export interface IPost {
  id: string;
  title:string;
  bodyText:string;
  createdBy_id:string;
  imageUrl?:string;
  videoUrl?:string;
  postTopic:string;
  likes: {[key: string]: any};
  comments: {[key: string]: any};
  user: IRegister;
}
