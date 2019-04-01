type StrOrFunc = string | ((...args: any) => string)

export interface ICreateRequestThunk {
  request: any
  key: StrOrFunc
  start?: (() => void)[],
  success: ((data: any) => void)[],
  failure?: ((reason: any) => void)[],
}