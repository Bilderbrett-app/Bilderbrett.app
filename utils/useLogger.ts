import { logger, mapConsoleTransport } from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    err: 3,
  },
  transport: mapConsoleTransport,
  transportOptions: {
    mapLevels: {
      debug: "log",
      info: "info",
      warn: "warn",
      err: "error",
    },
  },
};

export function useLogger(name: string) {
  const log = logger.createLogger(config);
  log.extend(name);
  return log; 
}