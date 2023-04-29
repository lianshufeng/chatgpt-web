export function sleep(ms: number) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `api/sleep?time=${ms}`, false)
  xhr.send()
}
