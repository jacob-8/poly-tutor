<script lang="ts">
  import { onDestroy } from 'svelte'

  export let handle_audio: (audio: File) => void

  let mediaRecorder: MediaRecorder
  let stream: MediaStream
  let ignoreData = false
  let listening = false

  async function initRecorder() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const extension = 'webm'
      const mimeType = `audio/${extension}`
      mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorder.ondataavailable = ({ data }) => {
        if (ignoreData || data.size <= 0) return
        const properties = { type: mimeType }
        const audioBlob = new Blob([data], properties)
        const audio_file = new File([audioBlob], `audio.${extension}`, properties)
        handle_audio(audio_file)
      }
      mediaRecorder.start()
    } catch (err) {
      console.error(err)
      alert(err)
    }
  }

  onDestroy(cancel)

  function cancel() {
    ignoreData = true
    stop()
  }

  function stop() {
    mediaRecorder?.stop()
    stream?.getTracks().forEach((track) => track.stop())
    listening = false
  }

  async function start() {
    ignoreData = false
    await initRecorder()
    listening = true
  }
</script>

<slot {start} {stop} {cancel} {listening} />
