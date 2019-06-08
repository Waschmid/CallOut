Project for 410: Computers, Sound, and Music at Portland State University Spring '19 term.

An attempt to create a physical layer data transmission protocol using sound and the WebAudio API.

Due to browser security policies, this must be served over https. In my dev environment I'm currently using the npm package `http-server` to accomplish this.

Despite my efforts, still very inconsistent. I've been able to successfully transmit small messages from my phone to laptop, but that's about it. Spaces especially seem to give it trouble. 

The basic rundown is that byte-data is converted into a frequency for every 2 bits, then broadcast. The receiver runs a series of Goertzel filters on the incoming samples, and if one of the filters is of a certain magnitude it stores its corresponding frequency in a buffer.

Whenever a new frequency is detected, or if it is determined that there are enough entries in the buffer that the data must be repeating, the buffer is flushed and the frequency it was holding is put into another buffer. Once this buffer has 4 entries, it is then converted back to a byte.

This module barely works and is fairly janky with very fuzzy methods of trying to extract the data from the incoming signal. In all honestly I'm surprised it works over the air at all right now. It *was* really fun to make though.