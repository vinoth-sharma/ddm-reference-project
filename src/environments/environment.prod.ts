declare const require: any;

export const environment = {
  production: true,
  baseUrl: `${window.location.origin}/`,
  version: require('../../package.json').version
};