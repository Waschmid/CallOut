import Coder from './coder.js'
import Filter from './filter.js'

class Receiver {
    constructor(audioContext, callback, params) {
        params = params || {}

        params.fftSize = params.fftSize || 512
        this.coder = new Coder(params)
        this.minPeak = params.minPeak || 10
        this.duration = params.duration || .05
        this.audioCtx = audioContext
        this.scriptNode = audioContext.createScriptProcessor(params.fftSize, 1, 0)

        this.filters = [
            new Filter(params.freqs[0], this.audioCtx.sampleRate, params.fftSize),
            new Filter(params.freqs[1], this.audioCtx.sampleRate, params.fftSize),
            new Filter(params.freqs[2], this.audioCtx.sampleRate, params.fftSize),
            new Filter(params.freqs[3], this.audioCtx.sampleRate, params.fftSize),
        ]

        this.freqsBuffer = []
        this.tempBuffer = []
        this.lastPeak = 0
        this.dataArray = []

        this.idle = false

        this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
            if(!this.idle) {
                var buf = audioProcessingEvent.inputBuffer
                let samples = new Float32Array(buf.getChannelData(0))

                // See if this sample contains a freq we want
                let freq = null
                let max = -Infinity
                this.filters.forEach(filter => {
                    let current = filter.filter(samples)
                    if(current > max) {
                        max = current
                        freq = filter.freq
                    }
                })

                // Freqs are stored in a buffer which is flushed when there's a change, or it detects a repeating freq, otherwise
                // the current freq hit is pushed into the buffer
                if(max > this.minPeak) {
                    if(this.tempBuffer.length > 0 && freq !== this.tempBuffer[0]) {
                        this.freqsBuffer.push(this.tempBuffer[0])
                        this.lastPeak = this.audioCtx.currentTime
                        this.tempBuffer = [freq]
                    } else if (this.tempBuffer.length > this.duration / (params.fftSize / this.audioCtx.sampleRate)) {
                        this.freqsBuffer.push(this.tempBuffer[0])
                        this.lastPeak = this.audioCtx.currentTime
                        this.tempBuffer = [freq]
                    } else {
                        this.tempBuffer.push(freq)
                    }

                    if(this.freqsBuffer.length === 4) {
                        this.dataArray.push(this.coder.freqsToByte(this.freqsBuffer))
                        this.freqsBuffer = []
                    }
                }

                // Once enough time passes, flush the temporary freq buffer if necessary and send back the collected data
                if(this.audioCtx.currentTime - this.lastPeak > 40 * this.duration && this.dataArray.length > 0) {
                    if(this.tempBuffer.length > 0 && this.freqsBuffer.length === 3) {
                        this.freqsBuffer.push(this.tempBuffer[0])
                        this.dataArray.push(this.coder.freqsToByte(this.freqsBuffer))
                    }

                    callback(new Uint8Array(this.dataArray))
                    this.idle = true
                }
            }
        }
    }
}

export default Receiver