import { httpsCallable, type HttpsCallableOptions } from "firebase/functions";

import { getFirebaseFunctions } from "./config";

/**
 * Invokes a Firebase HTTPS callable.
 * Pass the payload as the function argument — do NOT use Function.prototype.call
 * (that binds `this` and sends an empty `request.data` to Cloud Functions).
 */
export async function callFunction<TRequest = unknown, TResponse = unknown>(
  name: string,
  data?: TRequest,
  options?: HttpsCallableOptions,
): Promise<TResponse> {
  const fn = httpsCallable<TRequest, TResponse>(
    getFirebaseFunctions(),
    name,
    options,
  );
  // Omit payload when undefined (matches Flutter `.call()` with no args).
  const result =
    data === undefined
      ? await (fn as (data?: TRequest) => Promise<{ data: TResponse }>)()
      : await fn(data);
  return result.data;
}

/** @deprecated Prefer callFunction — kept only if needed for typing helpers */
export function callable<TRequest = unknown, TResponse = unknown>(
  name: string,
  options?: HttpsCallableOptions,
) {
  return httpsCallable<TRequest, TResponse>(getFirebaseFunctions(), name, options);
}


