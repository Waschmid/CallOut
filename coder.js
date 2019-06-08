class Coder {
    constructor(params) {
        params = params || {}
        this.freqs = params.freqs || [3550, 4050, 4550, 5050]
    }

    byteToFreqs(byte) {
        let binary = byte.toString(2)
        while(binary.length < 8) {
            binary = '0' + binary
        }

        console.log(binary)
        
        let freqs = []
        for(var i = 0; i < 4; i++) {
            let current = binary.slice(2*i, 2*i+2)
            if(current === '00') {
                freqs.push(this.freqs[0])
            } else if (current === '01') {
                freqs.push(this.freqs[1])
            } else if (current === '10') {
                freqs.push(this.freqs[2])
            } else if (current === '11') {
                freqs.push(this.freqs[3])
            }
        }
        return freqs
    }

    freqsToByte(freqs) {
        let byte = ''

        for(var i = 0; i < 4; i++) {
            if(freqs[i] === this.freqs[0]) {
                byte += '00'
            } else if(freqs[i] === this.freqs[1]) {
                byte += '01'
            } else if(freqs[i] === this.freqs[2]) {
                byte += '10'
            } else if(freqs[i] === this.freqs[3]) {
                byte += '11'
            }
        }

        return parseInt(byte, 2)
    }
}

export default Coder