class Receiver {
    constructor(audioContext, source) {
        this.listenAndDraw = this.listenAndDraw.bind(this)

        this.audioCtx = audioContext
        this.analyser = audioContext.createAnalyser()
        this.analyser.fftSize = 512
        this.bufferLength = this.analyser.frequencyBinCount
        this.dataArray = new Float32Array(this.bufferLength)

        source.connect(this.analyser)
    }

    listenAndDraw(canvasCtx) {
        let draw = () => {
            let WIDTH = canvasCtx.canvas.width
            let HEIGHT = canvasCtx.canvas.height

            requestAnimationFrame(draw)

            this.analyser.getFloatTimeDomainData(this.dataArray);

            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
            canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / this.bufferLength;
            var x = 0;

            for(var i = 0; i < this.bufferLength; i++) {
                var v = this.dataArray[i] * 200.0;
                var y = HEIGHT/2 + v;

                if(i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            canvasCtx.lineTo(WIDTH, HEIGHT/2);
            canvasCtx.stroke();
        }

        draw()
    }
}

export default Receiver