export interface IRegister {
  id?:number;
  email:string;
  password?:string;
  nickname:string;
  profilePic:string;
  savedPosts:any[]; // oggetto post
  returnSecureToken:boolean;
}
