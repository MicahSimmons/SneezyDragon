

class BgmMidi {
    constructor () {

        this.start = false;

        this.started = false;
        this.ready = false;

        this.synths = [];
        this.parts = [];

        this.toggleBgm = this.toggleBgm.bind(this);
        this.getTime = this.getTime.bind(this);
        this.init = this.init.bind(this);
        this.preload = this.preload.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);

        this.remix_channels = [
            74, // 1 - Violin 1 -> Flute
            72, // 2 - Violin 2 -> Clarinet
            41, // 3 - Violin 3
            45, // 4 - Viola 1 -> Tremolo Strings
            67, // 5 - Viola 2 -> Tenor Sax
            25, // 6 - Viola 3 -> Classical Guitar
            33, // 6 - Cello 1
            71, // 7 - Cello 2
            78, // 8 - Cello 3
            1
        ]
    }

    init () {

    }

    preload () {
        if (!this.ready) {
            Tone.start();
            MidiConvert.load("songs/brandenburg_three_bach.mid", (midi_json) => {
                console.log("Loaded Midi file.");
                Tone.Transport.bpm.value = midi_json.header.bpm;
                this.synths = [];
                this.parts = [];


                midi_json.tracks.forEach( (track, index) => {
                    console.log("Creating track number: " + track.channelNumber + " with instrument (" + track.instrument + "): " + track.instrumentNumber);
                    let ch = track.channelNumber;
                    /* Create a synth */
                    //let synth = new Tone.Synth().toDestination();
                    if (ch >= 0) {
                        let synth = new WebAudioTinySynth({internalcontext:0})
                        synth.setQuality(1);
                        Tone.connect(synth.setAudioContext(Tone.context), Tone.Master);
                        //synth.send([0xc0+ch, track.instrumentNumber+1]);
                        synth.send([0xc0+ch, this.remix_channels[ch]]);
        
                        /* Activate Midi Controls */
                        Object.keys(track.controlChanges).forEach( (key) => {
                            //console.log("Control key :" + key);
                            track.controlChanges[key].forEach( (change) => {
                                let number = change.number;
                                let time = change.time;
                                let value = change.value;
                                synth.send([0xb0+ch, number, value*100], time);
                            });
                        });
        
                        /* Create a part */
                        let part = new Tone.Part( (time, note) => {
                            //console.log(note);
                            synth.send([0x90+ch, note.midi, note.velocity * 100], time)
                            synth.send([0x80+ch, note.midi, 0], time + note.duration)
        
                        }, track.notes);
        
                        /* Save the results */
                        this.synths.push(synth);
                        this.parts.push(part); 
                    }
                });
                this.ready = true
            });    
        }
    }

    create () {

    }

    update () {
        if (this.ready) {
            if (this.start != this.started) {
                if (this.start) {
                    //this.parts.forEach((part) => part.start());
                    if (true) {
                        this.parts[0].start();
                        this.parts[1].start();
                        this.parts[2].start();    
                    }
                    if (true) {
                        this.parts[3].start();
                        this.parts[4].start();
                        this.parts[5].start();    
                    }
                    if (true) {
                        this.parts[6].start();
                        this.parts[7].start();
                        this.parts[8].start();    
                    }

                    Tone.Transport.seconds = 1.8;
                    Tone.Transport.start();
                } else {
                    //this.parts.forEach((part) => part.stop());
                    Tone.Transport.pause();
                }

                this.started = this.start;
            }
        }
    }

    toggleBgm( enable ) {
        console.log("here!");
        this.start = enable;

        if (!enable) {
            console.log("Stopping music now!");
            //this.parts.forEach((part) => part.stop());
            Tone.Transport.pause();
            console.log("Music stop complete.");
            this.started = this.start;
        }
    }

    getTime () {
        return Tone.Transport.seconds;
    }

}