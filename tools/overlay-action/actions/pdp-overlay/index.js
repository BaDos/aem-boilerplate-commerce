const fetch = require('node-fetch');
const { Core } = require('@adobe/aio-sdk');
const { fetchPlaceholdersForLocale } = require('../utils/placeholders.js');
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
  getLanguage,
  getConfig,
} = require('../utils/common.js');

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action');

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = ['STORE_BASE_PATH', 'STORE_CONFIG_ENV'];
    const requiredHeaders = [/* 'Authorization' */];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders);
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    const basePath = params.STORE_BASE_PATH;
    const configEnv = params.STORE_CONFIG_ENV;
    // eslint-disable-next-line no-underscore-dangle
    const urlPath = params.__ow_path.startsWith('/') ? params.__ow_path.substring(1) : params.__ow_path;
    const lang = getLanguage(urlPath);
    const configuration = await getConfig(`${basePath}/configs.json?sheet=${configEnv}`, lang);
    const placeholders = await fetchPlaceholdersForLocale(basePath, lang);

    // fetch content from external api endpoint
    // const res = await fetch(`${apiEndpoint}/${urlPath}`);
    // if (!res.ok) {
    //   throw new Error(`request to ${apiEndpoint} failed with status code ${res.status}`);
    // }

    // extract the content
    // const content = await res.text();
    // console.log(content);

    const response = {
      statusCode: 200,
      body: 'test',
    };

    // log the response status code
    logger.info(`${response.statusCode}: successful request`);
    return response;
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, 'server error', logger);
  }
}

exports.main = main;
