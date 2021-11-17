export interface IMenuGroups { 
    menuGroup: Array<IMenuGroup>;
    logoPath: string;
  };
  
  interface IMenus { 
    title: string;
    url: string;
  }
  
  interface IMenuGroup { 
    title: string;
    menu?: Array<IMenus>;
    path?: string;
  }

export enum LOCATION {
  header,
  footer
}

export class AppEvent<T> {
  constructor(
    public type: LOCATION,
    public payload: T,
  ) {}
}
