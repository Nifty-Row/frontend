export interface ICreateArtwork {
    category: string;
    assetType: string;
    title: string;
    symbol: string;
    description: string;
    media: Array<ICreatorMedia>;
    tokenId: number;
    dateIssued: Date;
  }

  export interface ICreatorMedia {
      media: string;
      mediaType: mediaType;
      mediaSizeMB: number;
  }

  enum mediaType{
    IMAGE = 0,
    VIDEO = 1,
    AUDIO = 2
  }

  export interface IAssetCategory {
    name: string;
    value: string;
  }

  export interface IAssetType {
      name: string;
      value: string;
  }