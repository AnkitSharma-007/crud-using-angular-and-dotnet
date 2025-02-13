import {
  Injector,
  StaticProvider,
  Type,
  runInInjectionContext,
} from '@angular/core';

/**
 * Allows you to get class instance or function result with providers for testing.  Intended to allow SIFERS-style tests with the new `inject()` syntax.
 *
 * @param config object containing the token or function and providers
 * @returns either class instance with the providers or return value of the function
 */
export function createTokenWithContext<ReturnT>(config: {
  tokenOrFunc: Type<ReturnT> | (() => ReturnT);
  providers: StaticProvider[];
}): ReturnT {
  const { providers, tokenOrFunc } = config;
  let injector = Injector.create({
    providers: [...providers],
  });

  if (isClass(tokenOrFunc)) {
    injector = Injector.create({
      providers: [...providers, { provide: tokenOrFunc }],
    });
    return injector.get(tokenOrFunc);
  }
  return runInInjectionContext(injector, tokenOrFunc);
}

function isClass<ReturnT>(
  tokenOrFunc: Type<ReturnT> | (() => ReturnT)
): tokenOrFunc is Type<ReturnT> {
  return (
    // Both functions and Classes are of type 'function'
    // The only way we found to disambiguate them is check their
    // actual string content and see if it starts with 'class'.
    typeof tokenOrFunc === 'function' &&
    tokenOrFunc.toString().startsWith('class')
  );
}
