export interface IBlogGroup { 
    blogGroup?: Array<IBlog>;
  };
  
export interface IBlog {
    mainLink: string;
    image: string; 
    title: string;
    date: string;
    heading: string;
    body: string;
}
  
