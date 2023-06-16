import { IRegister } from "./i-register";

export interface IPost {
  id: string;
  title:string;
  bodyText:string;
  createdBy_id:string;
  postDate: string;
  imageUrl?:string;
  videoUrl?:string;
  postTopic:string;
  likes: {[key: string]: any};
  saved: {[key: string]: any};
  comments: {[key: string]: any};
  user: IRegister;
  isCollapsed:boolean;
}
