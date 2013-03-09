$(function() {
        
    function getPlaySongSettings() {
        var jO = JSON.parse(localStorage['jsonObject']);
        var returner = {
            volume: jO.volume,
            noteLength: jO.noteLengthMs
        }
        return returner;
    }
    
    var melodyTextArea = $('#melody'),
        resultDiv = $('#resultDiv').html('initialized...'),
        playButton = $('#play'),
        playbackStatus = $('#playbackStatus');
        
        melodyTextArea.on('change', function() {
            updateResult();
        });
        melodyTextArea.on('keyup', function() {
           updateResult(); 
        });

        playButton.on('click', function () {
            playSong();
        });

    var parseMelody = function(text) {
        var melody = { distinctNotes:[], ticks:[] }
        var lines = text.split('\n');

        for (var i=0; i < lines.length; i++) {
            melody.ticks.push(parseLine(lines[i]));

            for (var j=0; j < melody.ticks[melody.ticks.length-1].length; j++)
                melody.distinctNotes.push(melody.ticks[melody.ticks.length-1][j]);
        }

        melody.distinctNotes = unique(melody.distinctNotes);
        return melody;
    }

    var unique = function(arr) {
        if (arr.length == 0) return [];
        arr.sort(compareNote);
        var res = [arr[0]];
        for (var i=1; i < arr.length; i++)
            if (compareNote(arr[i-1], arr[i]) != 0)
                res.push(arr[i]);
        return res;
    };

    var parseLine = function(line) {
        line = line.replace(/ |\r/g,'');
        var notes = [];
        for(var j=0; j < line.length; j++) {
            var name = parseNoteName(line[j++]);
            var modifier = interpretAsModifier(line[j]);
            if (modifier != null) j++;
            var octave = parseOctave(line[j]);
            notes.push({ name: name, modifier: modifier, octave: octave});
        }
        
        return notes;
    };

    var parseNoteName = function(toParse) {
        name = toParse.toUpperCase();
        if (name == 'H') name = 'B';
        if (name >= 'A' && name <= 'G') 
            return name;

        throw 'unexpected note "' + toParse + '"';
    };

    var interpretAsModifier = function(toParse) {
        if (toParse == '#') return '#';
        else if (toParse == 'b') return 'b';
        else return null;
    };

    var parseOctave = function(toParse) {
        if (toParse >= '0' && toParse <= '9') 
            return parseInt(toParse);
        
        throw 'unexpected octave "' + toParse + '"';
    };

    var baseNoteValues = {
        'C': 0,
        'C#': 1,
        'Db': 1,
        'D': 2,
        'D#': 3,
        'Eb': 3,
        'E': 4,
        'Fb': 4,
        'E#': 5,
        'F':5,
        'F#':6,
        'Gb':6,
        'G':7,
        'G#':8,
        'Ab': 8,
        'A': 9,
        'A#': 10,
        'Bb': 10,
        'B': 11,
        'Cb': 11,
        'B#': 12,
    };

    var noteValue = function(note) {
        return baseNoteValues[note.name + (note.modifier == null ? '' : note.modifier)] + 12 * (note.octave+1);
    };

    var compareNote = function(a,b) {
        return noteValue(a) - noteValue(b);
    };

    var updateResult = function() {
        var text = melodyTextArea.val();
        var res;
        try {
            var melody = parseMelody(text);
            res = 'pinNrX = ' + melody.distinctNotes.length + ';\n';
            res += 'pinNrY = ' + melody.ticks.length + ';\n';
            res += 'teethNotes="';
            for (var i=0; i < melody.distinctNotes.length; i++) {
                var note = melody.distinctNotes[i];
                res += note.name;
                res += note.octave;
                res += note.modifier == null ? ' ' : note.modifier;
            }
            res += '";\n';
            res += 'pins="';
            for (var t=0; t < melody.ticks.length; t++) {
                var tick = melody.ticks[t];
                for (var i=0; i < melody.distinctNotes.length; i++) {
                    var note = melody.distinctNotes[i];
                    var found = false;
                    for (var j=0; j < tick.length; j++)
                        found = found || compareNote(note, tick[j]) == 0;

                    res += found ? 'X' : ' ';
                }
            }
            res += '";';
        } catch (e) {
            res = e;
        }
        resultDiv.html(res);
    };

    var midiLoaded = false;
    var restToPlay = null;
    var playSong = function() {      
        var playSongSettings = getPlaySongSettings();  
        console.log('playSongSettings.volume = '+playSongSettings.volume);
        
        if (restToPlay != null) {
            restToPlay = null;
            playbackStatus.html('Stopped');
            playButton.html('Play!');
            return;
        }
        try {
            var melody = parseMelody(melodyTextArea.val());
            if (melody.ticks.length == 0)
                return;

            restToPlay = melody.ticks;
            playButton.html('Stop');

            //init MIDI plugin if necessary
            if (!midiLoaded) {
                playbackStatus.html('Loading soundfont...');
                MIDI.loadPlugin({
                    soundfontUrl: './soundfont/',
                    instrument: 'acoustic_grand_piano',
                    callback: function() {
                        midiLoaded = true;
                        MIDI.setVolume(0, playSongSettings.volume);
                        playLoop();
                    }
                });
                return;
            } else {
                playLoop();
            }
        } catch(e) { }
    };

    function playLoop() {
        
        var playSongSettings = getPlaySongSettings();
        
        if (restToPlay == null)
            return;

        //play all notes of this tick
        var notes = restToPlay.shift();
        var values = [];
        for (var i=0; i < notes.length; i++)
            values.push(noteValue(notes[i]));
        
        playbackStatus.html('playing... (' + restToPlay.length + ') note = ' + JSON.stringify(values));

        MIDI.chordOn(0, values, 127, 0);
        //~ window.setTimeout(function() { MIDI.stopAllNotes(); }, 1000);

        if (restToPlay.length != 0)
            setTimeout(playLoop, playSongSettings.noteLength);
        else
            playSong();
    };
});

