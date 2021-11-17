import { IArtwork } from "src/app/core/components/slider/presentation.interface";

  export interface IUser {
    userId: number;
    username: string;
    walletAddress: string;
    email?: string;
    socials?: IUserSocials;
    followers?: Array<IFollowers>;
    following?: Array<IFollowers>;
    likes?: Array<IUserLikes>;
    createdArtworks?: Array<IArtwork>;
    collections?: Array<IArtwork>;
    bids?: Array<IUserBids>;
    isActive: boolean;
    aboutInfo: string;
    displayImage: string;
    coverImage: string;
    assetTotalValue?: number;
    webUrl?: {url: string, title: string};
    joinDate: string;
    type: string;
  }

  export interface IFollowers {
    walletAddress: string;
    username: string;
    displayImage: string;
    assetTotalValue?: number;
    currency?: string;
  }
  interface IUserLikes {
    tokenId: string;
    type: string;
  }
  interface IUserBids{
    tokenId: string;
    bid: number;
    auctionId: string;
  }

  interface IUserSocials{
    twitterUrl?: string;
    facebookUrl?: number;
    telegramUrl?: string;
    youtubeUrl?: string;
    pinterestUrl?: string;
    discordUrl?: string;
  }