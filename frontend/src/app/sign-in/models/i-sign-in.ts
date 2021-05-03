/**
 * Wrapper to implement any kind of sign in options.
 * Yo can customize the parameters received by the sign in function
 */
export abstract class ISignIn<T> {

  /**
   * function called to sign in using this provider
   * @param options parameter that are required to implement an specific option
   */
  abstract signIn(options?: T): Promise<void>;
}
