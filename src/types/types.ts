export type Optional<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>;

export enum PaymentTypes {
  'TOP_UP' = 'TOP_UP',
  'WHITDRAW' = 'WHITDRAW' 
}