import Transmitter from './tx.js'
import Receiver from './rx.js'

// Chrome won't allow audio stuff without user action sooooo...
document.getElementById('create').addEventListener('click', () => {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'relative'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.width = 768
    canvas.height = 150
    document.body.appendChild(canvas)
    const canvasCtx = canvas.getContext('2d')
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)


    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioContext()
    let tx
    let rx

    document.getElementById('mic').addEventListener('click', () => {
        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia ({audio: true, video: false})
            .then((stream) => {
                let sourceNode = audioCtx.createMediaStreamSource(stream)
                rx = new Receiver(audioCtx, sourceNode)
                rx.listenAndDraw(canvasCtx)
            }).catch(err => {
                console.log('ERROR getting stream', err)
            })
        } else {
           console.log('getUserMedia not available in this enviornment')
        }
    })

    document.getElementById('simulate').addEventListener('click', () => {
        tx = new Transmitter(audioCtx, 440)
        rx = new Receiver(audioCtx, tx.transmit_signal)
        rx.listenAndDraw(canvasCtx)
        tx.transmit_signal.start()
        tx.transmit_signal.stop(audioCtx.currentTime + 5)
    })
})