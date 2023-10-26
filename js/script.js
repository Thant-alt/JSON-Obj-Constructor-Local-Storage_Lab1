document.addEventListener('DOMContentLoaded', function() {
    
    const key = 'notes';
    const empty_array = '[]';
    const writer_file = 'writer.html';
    const note_section = 'noteSection';
    const remove = 'remove';
    const place_holder = 'Write your wish for Christmas..'

    class noteConstructor {
        constructor(note) {
            this.note = note || '';
        }
        createElement(index, writeFile) {
            const noteSection = document.createElement('div');
            noteSection.className = note_section;    

            const textArea = document.createElement('textarea');
            textArea.placeholder = place_holder;
            textArea.value = this.note;

            noteSection.appendChild(textArea);

            if(writeFile) {
                const removeButton = document.createElement('button');
                removeButton.textContent = remove;
                removeButton.addEventListener('click', function() {
                    removeNotes(index);
                })

                noteSection.appendChild(removeButton);
            }

            return noteSection;
        }
    }

    const noteContainer = document.getElementById('noteContainer');
    const addButton = document.getElementById('addButton');
    let timeStored = document.getElementById('timeStored');
    let timeUpdated = document.getElementById('timeUpdated');

    function updateNotes() {
        const orgNotes = JSON.parse(localStorage.getItem(key) || empty_array);
        const contents = orgNotes.map(function(note) {
            return new noteConstructor(note);
        })

        noteContainer.innerHTML = '';
        const writer = window.location.pathname.endsWith(writer_file);

        contents.forEach(function(note, index) {
            noteContainer.appendChild(note.createElement(index, writer))
        })

    }

    function removeNotes(index) {
        const notes = JSON.parse(localStorage.getItem(key) || empty_array);
        notes.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(notes));
        updateNotes();
    }

    if(addButton) {
        addButton.addEventListener('click', function() {
            const notes = JSON.parse(localStorage.getItem(key) || empty_array);
            notes.push('');
            localStorage.setItem(key, JSON.stringify(notes));
            updateNotes();
        })
    }

    updateNotes();
    
    function noteStored() {
        if(timeStored) {
            let notes = Array.from(noteContainer.querySelectorAll('textarea')).map(function(text) {
                return text.value;
            })

            localStorage.setItem(key, JSON.stringify(notes));
            timeStored.textContent = `Stored at ${new Date().toLocaleDateString()}`;
        }
    }

    function noteRetrieved() {
        if(timeUpdated) {
            updateNotes();
            timeUpdated.textContent = `Updated at ${new Date().toLocaleDateString()}`;
        }        
    }

    setInterval(noteStored, 2000);
    setInterval(noteRetrieved, 2000);
})