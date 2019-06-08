class Filter {
    constructor(targetFreq, sampleRate, sampleSize) {
        let w0 = math.divide(math.multiply(math.number(targetFreq), math.number(2), math.pi), math.number(sampleRate))

        this.freq = targetFreq
        this.n = sampleSize - 1
        this.norm = math.exp(math.multiply(math.i, w0, math.number(sampleSize - 1)))
        this.coeffs = []
        for(var i = 0; i < this.n; i++ ) {
            this.coeffs[i] = math.exp(math.multiply(math.multiply(math.i, math.number(-1)), w0, math.number(i)))
        }
    }

    filter(sample) {
        let result = math.number(0)
        for(var i = 0; i < this.n; i++) {
            var term = math.multiply(math.number(sample[i]), this.coeffs[i])
            result = math.add(result, term)
        } 
        result = math.multiply(result, this.norm)
        return math.abs(result)
    }
}

export default Filter