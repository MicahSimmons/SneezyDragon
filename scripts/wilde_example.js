/*
 * audio scripts using Tone.js and MidiConvert
 * 
 * libraries found at:
 *  https://tonejs.github.io/
 *  https://github.com/baweaver/MidiConvert
 */ 

/* start audio playback of a midi file */
function midiAudioStart() {
  // init Tone.js library
  Tone.start();

  // define two synth instruments, one for each playback track
  let synth1 = new Tone.PluckSynth().toDestination();
  let synth2 = new Tone.Synth().toDestination();

  // call midiconvert to load an external midi file, convert it to Tone.js JSON
  // load() takes 2 arguments
  MidiConvert.load(
    "songs/brandenburg_three_bach.mid",
    function( midi ) {
      console.log('mini loaded and in json', midi);

      // make sure you set the tempo before you schedule the events
      Tone.Transport.bpm.value = midi.header.bpm;

      // pass in the note events from track 1 as second arg to Tone.Part
      // Part() takes 2 arguments
      // 1) function that reads the timing and note value (A-G) from the MIDI score and tells tone to play a not using synth1 as the instruments
      // 2) the array of musical notes and timings to play
      let midiPart1 = new Tone.Part(
        function(time, note) {
          //use the events to play the synth
          synth1.triggerAttackRelease(note.name, note.duration, time, note.velocity);
        },
        midi.tracks[1].notes
      );
      midiPart1.start();

      let midiPart2 = new Tone.Part(
        function(time, note) {
          //use the events to play the synth
          synth2.triggerAttackRelease(note.name, note.duration, time, note.velocity);
        },
        midi.tracks[2].notes
      );
      midiPart2.start();

      // start the transport to hear the events
      Tone.Transport.start();
    }
  );
}

function midiAudioStop () {
  Tone.Transport.stop();
}