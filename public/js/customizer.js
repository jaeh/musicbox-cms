"use strict";

$(function() {
    var jO = getJSONHtml();
    
    writeJSON(jO);
    
    initialDraw();    
    
    function initialDraw() {
        appendInfoContainer();
        
        appendLineContainer();
        
        appendImageContainer();
        appendToneIndicator();
        appendDropTargets();
        
        createNoteContainer();
        
        appendInputList();

        createTeethNoteContainer();
        createPinContainer();
        
        updateTickContainer();
    }
    
    function redraw() {
        
        updateLineContainer();
        
        updateInputList();

        updateTeethNoteContainer();
        updatePinContainer();
        
        updateTickContainer();
    }
    
    function updateTickContainer() {
        var js = getJSON();
        $('#tickDisplay').val(js.ticks);
    }
    
    
    
    function appendDropTargets() {
        createDropTargetContainer();
        
        updateDropTargetHtml();
    }
        
    function createDropTargetContainer() {
        var dropTargetContainerHtml = $(document.createElement('div'))
            .attr('id', 'dropTargetContainer');
        $('#sheetContent').append(dropTargetContainerHtml);
    }    
    
    function updateDropTargetHtml() {        
        var dropTargets = '',
            notes = '',
            column = $(document.createElement('div')).addClass('column'),
            dropTargetContainerHtml = $('#dropTargetContainer'),
            columnContainerHtml = $(document.createElement('div')).attr('id', 'columnContainer');
        
        for (var colIdx in jO.columns) {
            var dropTargetColumnHtml = $(document.createElement('div'))
                .addClass('column');
        
            for ( var noteIdx in jO.availableNotes) {
                var note = jO.availableNotes[noteIdx];
                
                dropTargetColumnHtml.append($(document.createElement('div')).addClass('droptarget'));
            }
            columnContainerHtml.append(dropTargetColumnHtml);
        }
        
        dropTargetContainerHtml.html(columnContainerHtml);
        
    }
    
    function createNoteContainer() {
        
        var noteContainerHtml = $(document.createElement('div'))
                .attr('id', 'noteContainer');
        
        $('#sheetContent').append(noteContainerHtml);
        
        updateNoteContainer();
    }
    
    function updateNoteContainer() {
        var noteContainerDiv = $('#noteContainer'),
            noteContainerHtml = $(document.createElement('div'))
                .addClass('noteContainer');
        
        for (var tickIdx = 0; tickIdx < jO.ticks; tickIdx++) {
            var noteContainerColumnHtml = $(document.createElement('div'))
                .addClass('column');
            
            for (var noteIdx = jO.usedNotes.length-1; noteIdx >= 0; noteIdx--) {
                
                var nt = jO.usedNotes[noteIdx];
                
                var noteHtml = $(document.createElement('div'))
                    .addClass('note')
                    .addClass('key-'+noteIdx)
                    .attr('data-note', nt.note)
                    .attr('data-octave', nt.octave)
                    .attr('data-tick', tickIdx)
                    .attr('data-modifier', nt.modifier);
                
                if( nt.tick == tickIdx) {
                    
                    noteHtml.addClass('keep').addClass('visible');
                }
                
                noteContainerColumnHtml.append(noteHtml);
            }
            noteContainerHtml.append(noteContainerColumnHtml);
        }
        noteContainerDiv.html(noteContainerHtml);
    }
    
    
    
    
    function appendLineContainer() {
        updateLineContainer();
    }
    /* unused for now
    function createLineContainer() {
        
        var lineContainerHtml = $(document.createElement('div'))
                .attr('id', 'lineContainer');
        
        $('#sheetContent').append(lineContainerHtml);
    }
    */
    
    function updateLineContainer() {
        var lineContainerDiv = $('#lineContainer');
        lineContainerDiv.html('');
        
        for (var lineIdx in jO.lines) {
            lineContainerDiv.append($(document.createElement('div')).addClass(jO.lines[lineIdx]).addClass('line'));
        }
    }
    
    $('#tickDisplay').on('click input propertychange', function () {
        
    });
    
    function appendInfoContainer() {
        for(var noteIdx in jO.notesInOctave) {
            $('#notesInOctave').val($('#notesInOctave').val() + jO.notesInOctave[noteIdx].note);
        }
        
        
        for(var noteIdx in jO.availableNotes) {
            $('#availableNotes').val($('#availableNotes').val() + jO.availableNotes[noteIdx].note);
        }
    }
    
    function appendToneIndicator() {
        var toneIndicatorContainerHtml = $(document.createElement('div'))
            .attr('id', 'toneIndicatorContainer');
        
        var reversed = jO.availableNotes;
        
        for (var noteIdx in reversed.reverse()) {
            var nt = reversed[noteIdx];
        
            var toneIndicatorHtml = $(document.createElement('div'))
                .addClass("toneIndicator")
                .html(nt.note + nt.octave);
                
            toneIndicatorContainerHtml.append(toneIndicatorHtml);
        }
        
        $('#sheetContent').append(toneIndicatorContainerHtml);
    }
    
    function appendImageContainer() {
        createImageContainer();
        
        updateImageContainer();
    }
    
    function createImageContainer() {
        var keyContainerHtml = $(document.createElement('div'))
            .attr('id', 'keyContainer');
            
        $('#sheetContent').append(keyContainerHtml);
    }
    
    function updateImageContainer() {
        var keyContainerDiv = $('#keyContainer'),
            keyContainerHtml = '';
        
        for (var imageIdx in jO.keyImages) {
            var img = jO.keyImages[imageIdx];
            
            var imgHtml = $(document.createElement('img'))
                .attr('src', img.src)
                .attr('title', img.title)
                .attr('alt', img.title)
                .attr('id', img.id);
                
            keyContainerDiv.append(imgHtml);
        }
    }
    
    function appendInputList() {
        createInputList();
        updateInputList();
    }
    
    function createInputList() {
        var inputList = $(document.createElement('ul'))
            .attr('id', 'inputList');
            
        $('#inputListContainer').append(inputList);
    }
    
    
    function updateInputList() {
        var resultListUl = $('#inputList'),
            melodyTextArea = $('#melody'),
            melodyHtmlString = '';
        
        resultListUl.html('');
        
        for (var i = 0; i < jO.ticks; i++) {      
            var tick = i;
            //~ tick += 1;
            
            var resultLabelHtmlStringArray = ($('#resultTick-'+tick).html() || '').split('') || [],
                inputHtmlString = $('#inputTick-'+tick).val() || '',
                resultLabelHtmlString = '';
            
            for(var noteIdx in jO.availableNotes) {
                var currentNote = jO.availableNotes[noteIdx],
                    resultLabelHtmlStringFragment = resultLabelHtmlStringArray[noteIdx] || '-';
                
                for(var ntIdx in jO.usedNotes) {
                    var nt = jO.usedNotes[ntIdx];
                    
                    if(!nt.note) {
                        console.log('note is not a note! with idx: ' + noteIdx);
                        continue;
                    }
                                        
                    if (nt.tick == tick){
                        if(nt.note == currentNote.note && nt.octave == currentNote.octave) {
                            resultLabelHtmlStringFragment = 'X';
                            inputHtmlString += ' '+nt.note+nt.octave+(nt.modifier||'');
                            melodyHtmlString += ' '+nt.note+nt.octave+(nt.modifier||'');
                        }
                    }
                }
                resultLabelHtmlStringArray[noteIdx] = resultLabelHtmlStringFragment;
            }
            
            resultLabelHtmlString = resultLabelHtmlStringArray.join('');
            melodyHtmlString += '\n';
            //~ console.log('resultLabelHtmlString after = '+resultLabelHtmlString);
                
            
            var label = $(document.createElement('label'))
                .attr('for', 'tick-'+tick)
                .html(tick);
            
            var input = $(document.createElement('input'))
                .attr('id', 'tick-'+tick)
                .attr('name', 'tick-'+tick)
                .val(inputHtmlString);
            
            var resultLabel = $(document.createElement('label'))
                .attr('for', 'tick-'+tick)
                .attr('id', 'resultTick'+tick)
                .html(resultLabelHtmlString);
            
            var resultListLi = $(document.createElement('li'))
                .append(label)
                .append(input)
                .append(resultLabel);
            
            
            resultListUl.append(resultListLi);      
        }
        melodyTextArea.html(melodyHtmlString);
    }
    
    
    
    
    function createTeethNoteContainer() {
            
        var teethNotesTextArea = $(document.createElement('textarea'))
                .attr('id', 'resultTeethNotes')
                .attr('name', 'resultTeethNotes')
                .attr('rows', '1')
                .attr('cols', '106');
        
        $('#resultContainer').append(teethNotesTextArea);
        
        updateTeethNoteContainer();
    }
    
    
    
    function updateTeethNoteContainer() {
        var resultTeethNoteTextArea = $('#resultTeethNotes'),
            teethNotesHtml = 'teethNotes="',
            distinctNotes = makeNotesUnique(jO.availableNotes);
        
        for(var noteIdx in distinctNotes) {
            var nt = distinctNotes[noteIdx];
            
            teethNotesHtml += nt.note+nt.octave+(nt.modifier||'');
        }
        
        teethNotesHtml += '";';
        
        resultTeethNoteTextArea.html(teethNotesHtml);        
    }

    
    function createPinContainer() {
        var pinTextArea = $(document.createElement('textarea'))
                .attr('id', 'resultPins')
                .attr('name', 'resultPins')
                .attr('rows', '1')
                .attr('cols', '106');
        
        $('#resultContainer').append(pinTextArea);
        
        updatePinContainer();
    }
    
    function updatePinContainer() {
        
        var resultListUl = $('#resultPins');
        var t = '';
        var resultLabelHtmlStringArray = ($('#resultPins').html() || '').split('') || [],
            resultLabelHtmlString = '';
            
        for (var i = 0; i < jO.ticks; i++) {      
            var tick = i;
            //~ tick += 1;
            resultLabelHtmlStringArray = ($('#resultPins').html() || '').split('') || [];
            
            for(var noteIdx in jO.availableNotes) {
                var currentNote = jO.availableNotes[noteIdx],
                    resultLabelHtmlStringFragment = '-';
                
                for(var ntIdx in jO.usedNotes) {
                    var nt = jO.usedNotes[ntIdx];
                    
                    if(!nt.note) {
                        console.log('note is not a note! with idx: ' + noteIdx);
                        continue;
                    }
                                        
                    if (nt.tick == tick){
                        if(nt.note == currentNote.note && nt.octave == currentNote.octave) {
                            resultLabelHtmlStringFragment = 'X';
                        }
                    }
                }
                if(resultLabelHtmlStringFragment == undefined) {
                    resultLabelHtmlStringFragment = '-';
                }
                
                resultLabelHtmlString += resultLabelHtmlStringFragment;
            }
            //~ console.log('resultLabelHtmlString after = '+resultLabelHtmlString);
        }
        
        resultListUl.html('pins="'+resultLabelHtmlString+'";');     
    }
    

    /******* events */
    
    $('.note').on({
        mouseenter: function (evt) {
            $(evt.target).addClass('visible');
        },
        mouseleave: function (evt) {
            if (!$(evt.target).hasClass('keep')) {
                $(evt.target).removeClass('visible');
            }
        },
        click: function (evt) {
            var tar = $(evt.target),
                note = {
                    tick: tar.attr('data-tick'), 
                    octave: tar.attr('data-octave'), 
                    note: tar.attr('data-note'),
                    modifier: tar.attr('data-modifier') || ''
                };

            if (typeof note.tick === 'undefined') {
                console.log('click function died, note.tick is not set.');
                return false;
            }
            
            if(!tar.hasClass('keep')) {
                console.log('pushing note  = '+note.note+ ' octave ='+note.octave+' modifier = '+ note.modifier+' tick: '+note.tick);
            
                jO.usedNotes.push(note);
                
                jO.teethNotes = makeNotesUnique(jO.teethNotes.push(note));
                
            }else{
                console.log('remove note  = '+note.note+ ' octave ='+note.octave+' modifier = '+ note.modifier+' tick: '+note.tick);
                
                jO.usedNotes = removeNoteFromArray(jO.usedNotes, note);
                
                jO.teethNotes = removeNoteFromArray(jO.teethNotes, note);
                
                tar.removeClass('visible');
            }
            
            
            writeJSON(jO);
            
            redraw();
            
            tar.toggleClass('keep');
        }
    });
    
    
    function showHideable(hideableId) {
        $('#' + hideableId).removeClass('hidden');
    }
    
    function hideHideables() {
        $('.hideable').each(function() {
           $(this).addClass('hidden'); 
        });
    }
    
    $('.showHideUI').on('click', function(evt) {
       hideHideables(); 
       showHideable($(this).attr('data-show'));
    });
    
    
    function makeNotesUnique(arr) {
        var foundValue = false,
            returnArray = [];
        
        for(var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                arr[i].modifier = arr[i].modifier || '';
                var j = i;
                j++;
                
                for(j; j < arr.length; j++) {
                    if (arr[j]) {
                        arr[j].modifier = arr[j].modifier || '';
                        if (i != j) {
                            if (arr[j].note == arr[i].note && arr[j].octave == arr[i].octave) {
                                if (arr[j].modifier == arr[i].modifier) {
                                    arr[j] = 'bla';
                                }
                            }
                        }
                    }
                }
            }
        }
        
        for(var i in arr) {
            if (arr[i] !== 'bla') {
                returnArray.push(arr[i]);
            }
        }
        //~ console.log('returnArray = ');
        //~ console.log(returnArray);
        return returnArray;
    }
    
    function removeNoteFromArray(array, note) {
        var oldArray = jO.usedNotes,
            newArray = [];
        
        for(var i in oldArray) {
            var nt = oldArray[i];
            
            if (nt.note == note.note && nt.octave == note.octave && nt.modifier == note.modifier && nt.tick == note.tick ){
               oldArray[i] = null; 
            }
        }
        
        for(var i in oldArray) {
            if(oldArray[i] !== null) {
                newArray[i] = oldArray[i];
            }
        }
        
        return newArray;
    }
    
    
    function getJSONHtml() {
        var jsonString = localStorage['jsonObject'];
        
        //~ var fal = false;
        var jsonObject = JSON.parse($('#jsonObject').val());
        //~ if(typeof jsonString !== 'undefined') {
            //~ if (jsonString !== 'undefined' && jsonString.length > 2 && jsonString.indexOf('{') !== 0 /*&& lastLetter !== "}"*/) {
                //~ console.log('jsonString length = '+(jsonString == 'null'));
                //~ 
                //~ jsonObject = JSON.parse(jsonString);
            //~ }
        //~ }
        
        return jsonObject;
    }    
    
    
    function getJSON() {
        return JSON.parse(localStorage["jsonObject"]);
    }
    
    function writeJSON(jsonObject) {
        
        
        if(jsonObject.volume > 127){
            jsonObject.volume = 127;
        }else if(jsonObject.volume < 0) {
            jsonObject.volume = 0;
        }
        
        if(jsonObject.noteLengthMs < 1) {
            jsonObject.noteLengthMs = 1;
        }
        
        var jsonString = JSON.stringify(jsonObject);
        
        var l = JSON.parse(jsonString);
        
        var k = JSON.stringify(l);
        //~ if ( k.length !== jsonString.length) {
        
        $('#jsonObject').val(jsonString);
        localStorage['jsonObject'] = jsonString;   
        //~ } else {
            //~ console.log('your json string had errors. we check those by checking the length of the object after changing it. this error may not be right, so maybe remove a node, then save then readd the note and your changes to save them. sorry.');              
        //~ }
    }
    
    $("#saveJson").on("click", function() {
        var js = JSON.parse($('#jsonObject').val());
        
        writeJSON(js);
    });

});
