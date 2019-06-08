import Transmitter from './tx.js'
import Receiver from './rx.js'

// Chrome won't allow audio stuff without user action sooooo...
document.getElementById('create').addEventListener('click', () => {

    function stringToBinary(str) {
        var buf = new ArrayBuffer(str.length*2)
        var binArr = new Uint16Array(buf)
        for (var i=0; i < str.length; i++) {
          binArr[i] = str.charCodeAt(i)
        }
        return buf
    }

    let data = new Uint8Array(stringToBinary('testing'))      

    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioContext()
    let tx
    let rx

    let params = {
        duration: .05,
        rampTime: .002,
        fftSize: 256,
        freqs: [3550, 4050, 4550, 5050],
        minPeak: 20
    }

    let onDataLoaded = function(data) {
        let typedData = new Uint16Array(data)
        let str = String.fromCharCode.apply(null, typedData);
        document.getElementById('message').innerHTML = 'Message is: ' + str
    }

    document.getElementById('mic').addEventListener('click', () => {
        if(navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia ({audio: true, video: false})
            .then((stream) => {
                let sourceNode = audioCtx.createMediaStreamSource(stream)
                rx = new Receiver(audioCtx, onDataLoaded, params)
                sourceNode.connect(rx.scriptNode)  
            }).catch(err => {
                console.log('ERROR getting stream', err)
            })
        } else {
           console.log('getUserMedia not available in this enviornment')
        }
    })

    document.getElementById('simulate').addEventListener('click', () => {
        let transfer = new GainNode(audioCtx)
        transfer.gain.value = 1
        params.output = transfer
        tx = new Transmitter(audioCtx, params)
        rx = new Receiver(audioCtx, onDataLoaded, params)
        transfer.connect(rx.scriptNode)
        tx.send(data)
    })

    document.getElementById('broadcast').addEventListener('click', () => {
        tx = new Transmitter(audioCtx, params)
        tx.send(data)
    })
})