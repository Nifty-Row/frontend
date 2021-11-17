export interface INavButton { 
    create?:  buttonSetup;
    wallet?: buttonSetup;
}

interface buttonSetup {
    title: string;
    path: string;
}