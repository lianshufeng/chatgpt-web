function TTSSpeaker() {
  const _window: any = window
  let tts: any = null

  function init() {
    tts = _window.speaker()
    tts.connectWs()
  }
  function setMute(flag: boolean) {
    tts.setMute(flag)
  }
  function sendMessage(text: string) {
    try {
      tts.sendMessage(text)
    }
    catch (e) {
      console.error(e)
    }
  }

  return {
    init,
    setMute,
    sendMessage,
  }
}

const tts = TTSSpeaker()
export default tts
