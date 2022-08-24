export interface Response<T> {
  code: number
  msg: string
  data: T
}

export let Endpoint = {
  Organization: 'http://organization.api.dev.risin.work',
  Staffer: 'http://staffer.api.dev.risin.work'
}
