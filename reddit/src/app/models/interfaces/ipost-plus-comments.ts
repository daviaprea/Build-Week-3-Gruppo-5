import { IPost } from "./i-post";
import { Icomment } from "./icomment";

export interface IPostPlusComments {
  post: IPost,
  comments: Icomment[];
}
