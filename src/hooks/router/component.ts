import { useContext, Context } from "react";
import {
  LocationContext,
  LocationContextObject,
  RouterContext,
  RouterContextObject,
  ERROR_UNDEFINED_CONTEXT,
} from './';

/**
 * 
 * @description Check if call context in provider
 * @param context 
 * @returns 
 */
function validateContext<T>(context: Context<T>) {
  const contextGetter = useContext(context);
  if (contextGetter === undefined) {
    throw new Error(ERROR_UNDEFINED_CONTEXT);
  }
  return contextGetter;
}

/**
 * 
 * @description Location context 
 * @description Handle actions related to screens 
 */
export const useLocation = () => {
  const context = validateContext<LocationContextObject>(LocationContext);
  return context;
}

/**
 * 
 * @description Router context 
 * @description Contains screens and screen status
 */
export const useRouter = () => {
  const context = validateContext<RouterContextObject>(RouterContext);
  return context;
}