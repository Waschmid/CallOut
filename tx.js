class Transmitter {
    constructor(audioContext, freq) {
        this.audioCtx = audioContext
        this.transmit_signal = new OscillatorNode(audioContext, {type: 'sine', frequency: freq})
    }
}

export default Transmitter