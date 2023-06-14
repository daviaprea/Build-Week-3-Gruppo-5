export interface IRegister {
  id?:string;
  email:string;
  password?:string;
  nickname:string;
  profilePic:string;
  savedPosts:any[]; // oggetto post
  returnSecureToken:boolean;
  uniqueId: string;
}
