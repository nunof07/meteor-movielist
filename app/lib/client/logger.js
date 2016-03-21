angular
    .module('movielist')
    .service('logger', logger);

function logger(nemSimpleLogger) {
    const logger = nemSimpleLogger.spawn();
    
    logger.doLog = true;
    logger.currentLevel = logger.LEVELS.debug;
    
    return logger;
}