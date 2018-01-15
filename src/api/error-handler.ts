import {
  window as Window,
} from 'vscode';
import Telemetry from './../telemetry';
import { SQLToolsException } from './exception';

namespace ErrorHandler {
  let logger = console;
  export function create(message: string, yesCallback?: Function): (reason: any) => void {
    return async (error: any): Promise<void> => {
      if (error) {
        if (error.swallowError) return;
        logger.error(`${message}: `, error.stack);
        message = `${message} ${error.toString()}`;
      }
      if (typeof yesCallback !== 'function') {
        Telemetry.registerErrorMessage(message, error, 'No callback');
        Window.showErrorMessage(message);
        return;
      }
      const res = await Window.showErrorMessage(`${message} Would you like to see the logs?`, 'Yes', 'No');
      Telemetry.registerErrorMessage(message, error, res === 'Yes' ? 'View Log' : 'Dismissed');
      if (res === 'Yes') {
        yesCallback();
      }
    };
  }
  export function setLogger(newLogger) {
    logger = newLogger;
  }
}

export default ErrorHandler;