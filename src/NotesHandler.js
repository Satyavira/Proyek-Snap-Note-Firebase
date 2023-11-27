//fungsi untuk mendapatkan tanggal hari ini
function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    return dd + '-' + mm + '-' + yyyy;
}
//mencari localStorage notes jika ada dan menparse-nya ke js object. 
//Jika tidak akan menyimoan array kosong ke notes 
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let updateId;

//mendeklarasi bbrp variabel pendukung
titleTag = document.querySelector('.modal-note-title')
dateTag = document.querySelector('.modal-note-date')
labelTag = document.querySelector('.modal-note-label')
contentTag = document.querySelector('.modal-note-content')
addBtn = document.querySelector("#addNoteBtn")
updateBtn = document.querySelector(".modal-button .btn-success")
deleteBtn = document.querySelector(".modal-button .btn-danger")
archiveBtn = document.querySelector(".modal-button .btn-primary")

//Fungsi menampilkan notes
function showNotes(){
    document.querySelectorAll(".note-wrap").forEach(note => note.remove());
    notes.forEach((note, index) => {
        let divTag = `<div class="note-wrap col-6 col-xl-2 col-lg-3 col-md-4 m-3">
                        <div class="note card p-3" onclick="displayNote(${index}, '${note.title}', '${note.date}', '${note.label}', '${note.content}')">
                            <h5 class="card-title">${note.title}</h5>
                            <p class="card-date mb-2" style="font-size: 14px; color: #6A6A6A;">${note.date}</p>
                            <p class="card-text">${note.content}</p>
                        </div>
                    </div>`;
        document.querySelector('.background .row').innerHTML += divTag;
    });
}
showNotes(); //tampilkan notes

// Fungsi update note (memunculkan modal) ketika note ditekan
function displayNote(noteId, title, date, label, content){
    titleTag.value = title;
    dateTag.textContent = date;
    labelTag.value = label;
    contentTag.value = content;
    noteIndex = noteId;
    var noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    noteModal.show();
}

function updateNote(noteId, title, date, label, content){
    updateId = noteId
    notes[updateId] = {title: title, date: date, label: label, content:content}; //updating specified note
    localStorage.setItem("notes", JSON.stringify(notes));
    // document.querySelector(".modal-header .btn-close").click();
    showNotes();
}

//membuat event ketika add note diklik
addBtn.addEventListener("click", e => {
    // e.preventDefault();

    //deklarasi data dalam note
    let noteTitle = document.getElementById("floatingInput").value;
    let noteDate = getCurrentDate();
    let noteLabel = document.getElementById('floatingLabel').value;
    let noteContent = document.getElementById('floatingContent').value;

    //title dan content tidak boleh kosong ketika mau add Note
    if(noteTitle || noteContent){
        let noteInfo = {
            title: noteTitle, date: noteDate, label: noteLabel, content:noteContent
        }
        notes.push(noteInfo); //menambah note baru ke notes
        //menyimpan notes ke localstorage
        localStorage.setItem("notes", JSON.stringify(notes));
    }
    showNotes();
});

//membuat event onclick pada update button
updateBtn.addEventListener("click", () => {
    // isUpdate = true;
    updateNote(noteIndex, titleTag.value, dateTag.textContent, labelTag.value, contentTag.value)
    document.querySelector(".modal-header .btn-close").click();
});

deleteBtn.addEventListener("click", () => {
    notes.splice(noteIndex, 1); //menghapus note dari array
    //simpan note yang telah terupdate ke localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    document.querySelector(".modal-header .btn-close").click();
    showNotes();
});