export interface IEvents {
  type: string;
  data: any;
  id: number
}

export interface ILikes {
  tokenId: number,
  likeCount: number;
}

export interface IFollow {
  followCount: number,
  id: string
}