declare const require: any;

export const environment = {
  production: true,
  baseUrl: `${window.location.origin}/`,
  version: require('../../package.json').version
};


export var constants_value = {
  encryption_key : '_dummy_'
}