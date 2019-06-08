import Coder from "./coder.js"

class Transmitter {
    constructor(audioContext, params) {
        this.audioCtx = audioContext
        params = params || {}
        this.coder = new Coder(params)
        this.duration = params.duration || .05
        this.rampTime = params.rampTime || .002

        this.output = params.output || this.audioCtx.destination
    }

    send(binaryData) {
        let array = new Uint8Array(binaryData)
        let start = this.audioCtx.currentTime + 1
        for(var i = 0; i < array.length; i++) {
            let freqs = this.coder.byteToFreqs(array[i])
            let time = start + (i * this.duration * 4)
            this.scheduleFreqs(freqs, time)
        }
    }

    scheduleFreqs(freqs, time) {
        for(var i = 0; i < 4; i++) {
            let volume = new GainNode(this.audioCtx)
    
            volume.gain.value = 0
            volume.gain.setValueAtTime(0, time)
            volume.gain.linearRampToValueAtTime(1, time + this.rampTime)
            volume.gain.setValueAtTime(1, time + this.duration - this.rampTime)
            volume.gain.linearRampToValueAtTime(0, time + this.duration)

            volume.connect(this.output)
            
            let freq = freqs[i]
            let osc = new OscillatorNode(this.audioCtx, {frequency: freq})
            osc.connect(volume)
            osc.start(time)
            time += this.duration
        }
    }
}

export default Transmitter