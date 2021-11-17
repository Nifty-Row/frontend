/**
 * Global Configuration, i.e. languages, locale, date formats etc.
 *
 * Shared settings for all environments: dev, prod, stage etc.
 */
import { AppConfig } from '../interfaces/app-config.interface';
import { IRouter } from '../interfaces/dynamicUrl.interface';

export const appConfig: AppConfig = {
  appTitle: 'Nifty Row',
  browserTabTitleDelimiter: ' | ',
  defaultLanguage: 'en_GB'
};

export const creatorPage: IRouter = {
  path:  "",
}

export const ownerPage: IRouter = {
  path:  "",
}

export const placeBidPage: IRouter = {
  path:  "",
}
