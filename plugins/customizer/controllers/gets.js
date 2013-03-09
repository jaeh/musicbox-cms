"use strict";

var path = require('path'),
    fs = require('fs');

exports.customizer = function (req, res) {
    
    var templateFile = req.app.get('theme') + '/customizer/customizer.html',
        i = 15,
        returnObject = {
            allOctaves: [4,5],
            keyImages: [
                //~ {src: '/img/musicbox/notes/sopran.png', id: 'sopran', title: 'soprankey'},
                {src: '/img/musicbox/notes/violin.png', id: 'violin', title: 'violinkey'}//,
                //~ {src: '/img/musicbox/notes/bass.png', id: 'bass', title: 'basskey'}
            ],
            lines: ['line dotted', 'line dotted',
                    'line', 'line', 'line', 'line', 
                    'line last', 'line dotted', 
                    //~ 'line', 'line', 'line','line', 
                    //~ 'line last', 'line dotted', 
                    //~ 'line', 'line', 'line', 'line',
                    //~ 'line last', 'line dotted'
            ],
            columns: [],
            notesInOctave: [
                {note: 'B', modifiers: ['b']},
                {note: 'A', modifiers: ['#', 'b']},
                {note: 'G', modifiers: ['#', 'b']},
                {note: 'F', modifiers: ['#']},
                {note: 'E', modifiers: ['b']},
                {note: 'D', modifiers: ['#', 'b']},
                {note: 'C', modifiers: ['#']}
            ],
            teethNotes: [],
            usedNotes: [],
            availableNotes: [],
            ticks: 15,
            noteLengthMs: 500,
            volume: 127
        };
    
    for (i = 0; i <= 14; i++) {
        returnObject.columns.push(i);
    }
    
    var tick = 0;
    for(var octaveIdx in returnObject.allOctaves) {
        var octave = returnObject.allOctaves[octaveIdx];
        
        for(var noteIdx = returnObject.notesInOctave.length - 1; noteIdx >= 0; noteIdx--) {
            var note = returnObject.notesInOctave[noteIdx];
            
            returnObject.availableNotes.push({note: note.note, octave: octave, modifiers: note.modifiers, tick: tick});
            returnObject.usedNotes.push({note: note.note, octave: octave, modifiers: note.modifiers, tick: tick});
            
            returnObject.teethNotes.push({note: note.note, octave: octave, modifiers: note.modifiers, active: true});
            tick++;
        }
    }

    returnObject.availableNotes.push({note: 'C', octave: 6, modifiers: ['#'], tick: tick});
    returnObject.teethNotes.push({note: 'C', octave: 6, modifiers: ['#']});
    returnObject.usedNotes.push({note: 'C', octave: 6, modifiers: ['#'], tick: tick});
    
    fs.exists(path.join(req.app.get('views'), templateFile), function (exists) {

        if (!exists) {
            res.redirect('404');
        } else {
            res.render(templateFile, {returnObject: JSON.stringify(returnObject)});
        }
    });
}
