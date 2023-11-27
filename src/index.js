const settingButton = document.querySelectorAll(".settings");
const settingContainer = document.querySelectorAll(".setting-details");

settingButton.forEach((element) => {
  element.addEventListener("click", () => {
    settingButton.forEach((elem) => {
      elem.classList.remove("active");
    });
    element.classList.add("active");
    let current = element.className;
    current = current.split(" ");
    current = current[2];
    // console.log(current);

    settingContainer.forEach((el) => {
      el.classList.remove("inactive");
    });
    settingContainer.forEach((el) => {
      let el_class = el.className;
      el_class = el_class.split(" ");
      // console.log(el_class);
      el_class.forEach((ele) => {
        if (current == ele) {
          el.classList.remove("inactive");
          // console.log("Hello");
          // console.log(el.className);
          // console.log(el.innerHTML);
        } else {
          // console.log("Dor");
          el.classList.add("inactive");
          // console.log(el.className);
        }
      });
    });
  });
});

// console.log("Hello World");

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCh_865N7AfrYMZp6Ht1IMz4TNYRZ4pV1Y",
  authDomain: "snap-note.firebaseapp.com",
  projectId: "snap-note",
  storageBucket: "snap-note.appspot.com",
  messagingSenderId: "810060069048",
  appId: "1:810060069048:web:2fbaf1e5392b256083dc4d",
  measurementId: "G-HCK5BJEHWD",
};

//init firebase app
initializeApp(firebaseConfig);
//init service
const db = getFirestore();
const auth = getAuth();





//CRUD

function getCurrentDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  let yyyy = today.getFullYear();

  return dd + '-' + mm + '-' + yyyy;
}

//collection ref
let colRef
const updateBtn = document.querySelector(".modal-button .btn-success")
const deleteBtn = document.querySelector(".modal-button .btn-danger")
const archiveBtn = document.querySelector(".modal-button .btn-primary")
let queries

if (window.location.href == "http://127.0.0.1:5500/dist/notes.html") {
  colRef = collection(db, "notes")
  queries = query(colRef, orderBy('createdAt'))
  //adding documents
  const addNoteForm = document.querySelector('#addNoteForm');
  addNoteForm.addEventListener('submit', (e) => {
    e.preventDefault();//it is used for not refreshing the website
    let noteTitle = document.getElementById("floatingInput").value;
    let noteDate = getCurrentDate();
    let noteLabel = document.getElementById('floatingLabel').value;
    let noteContent = document.getElementById('floatingContent').value;
    if (noteTitle && noteContent) {
      addDoc(colRef, {
        title: noteTitle,
        date: noteDate,
        createdAt: serverTimestamp(),
        label: noteLabel,
        content: noteContent,
      })
      .then(() => {
        addNoteForm.reset();
        showNotes();
      })
    }
  })
  archiveBtn.addEventListener('click', (e) => {
    e.preventDefault();//it is used for not refreshing the website
    const colRef = collection(db, 'archive')
    const docRef = doc(db, 'notes', noteId)
    deleteDoc(docRef)
    .then(() => {
      addDoc(colRef, {
        title:titleTag.value,
        date: dateTag.textContent,
        createdAt: serverTimestamp(),
        label: labelTag.value,
        content: contentTag.value
      })
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    })
  })
}
else if (window.location.href == "http://127.0.0.1:5500/dist/archive.html") {
  colRef = collection(db, "archive")
  queries = query(colRef, orderBy('createdAt'))
  const unArchiveBtn = document.querySelector(".modal-button .btn-warning")
  unArchiveBtn.addEventListener('click', (e) => {
    e.preventDefault();//it is used for not refreshing the website
    const colRef = collection(db, 'notes')
    const docRef = doc(db, 'archive', noteId)
    deleteDoc(docRef)
    .then(() => {
      addDoc(colRef, {
        title:titleTag.value,
        date: dateTag.textContent,
        createdAt: serverTimestamp(),
        label: labelTag.value,
        content: contentTag.value
      })
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    })
  })
}
else {
  colRef = collection(db, "notes")
  const label = document.querySelector(".label")
  const labelList = document.querySelector(".labelList")
  var arrayOfLabel = []
  // console.log(value)
  queries = query(colRef, where("label", "==", `${label.value}`))
  // queries = query(colRef, orderBy('createdAt'))
  // Assume you have a variable to store the selected label
  let selectedLabel = "None"; // You can initialize it with a default label

  // Function to update the dropdown button text
  function updateLabelButton() {
      const labelButton = document.querySelector('.label');
      labelButton.innerText = selectedLabel;
  }

  // Sample event listener for label selection (you need to adapt this based on your actual logic)
  document.querySelector('.dropdown-menu.labelList').addEventListener('click', (event) => {
      if (event.target.classList.contains('dropdown-item')) {
          selectedLabel = event.target.textContent;
          updateLabelButton();
          const value = (selectedLabel != "None") ? selectedLabel : ""
          queries = query(colRef, where("label", "==", `${value}`))
          showNotes()
      }
  });

  // Initial update of the label button text
  updateLabelButton();
  function checkLabel() {
    getDocs(colRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          let inside = {...doc.data(), id: doc.id};
          if (!(inside.label in arrayOfLabel)) {
            arrayOfLabel.push(inside.label)
            let divTag = `<li><a class="dropdown-item" href="#">${inside.label}</a></li>`
            labelList.innerHTML += divTag
            console.log(labelList.innerHTML)
          }
        })
      })
      .catch(err => {
        console.log(err.message);
      })
      
  }
  checkLabel()
  console.log(arrayOfLabel)
  // console.log(labelList.innerHTML)
  // queries3 = query(colRef, where("label", "==", `${label.value}`))

  
  archiveBtn.addEventListener('click', (e) => {
    e.preventDefault();//it is used for not refreshing the website
    const colRef = collection(db, 'archive')
    const docRef = doc(db, 'notes', noteId)
    deleteDoc(docRef)
    .then(() => {
      addDoc(colRef, {
        title:titleTag.value,
        date: dateTag.textContent,
        createdAt: serverTimestamp(),
        label: labelTag.value,
        content: contentTag.value
      })
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    })
    .catch(err => {
      console.log(err.message);
    })
  })
}
// addDoc(colRef, {
//   label: "",
//   note: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur explicabo cumque sunt!",
//   title: "Hello"
// })

//get collection data
getDocs(colRef)
  .then((snapshot) => {
    snapshot.docs.forEach((docu) => {
      let inside = {...docu.data(), id: docu.id};
      // console.log(inside);
      // if (docu.id === "CR3duFE9gDeaXefwtIvp") {
      //   console.log("Past");
      // }
      // else if (docu.id !== "CR3duFE9gDeaXefwtIvp") {
      //   const docRef = doc(db, 'notes', docu.id);
      //   deleteDoc(docRef);
      //   console.log("Success");
      // }
      // else {
      //   console.log("Fail");
      // }
    });
  })
  .catch(err => {
    console.log(err.message);
  })

// const queries2 = query(reference())
// realtime collection data
onSnapshot(queries, (snapshot) => {
  snapshot.docs.forEach((docu) => {
    let inside = {...docu.data(), id: docu.id};
    console.log(inside);
  });
});

// queries
// const queries0 = query(colRef, where("title", "==", "Fred"))
// const queries1 = query(colRef, where("title", "==", "Fred"), orderBy('title','desc'))
// const queries2 = query(colRef, orderBy('createdAt'))

//Fungsi menampilkan notes
//mendeklarasi bbrp variabel pendukung
let titleTag = document.querySelector('.modal-note-title');
let dateTag = document.querySelector('.modal-note-date');
let labelTag = document.querySelector('.modal-note-label');
let contentTag = document.querySelector('.modal-note-content');
let noteId;

// Fungsi update note (memunculkan modal) ketika note ditekan
document.querySelector('.background .row').addEventListener('click', function(event) {
  const target = event.target.closest('.note-wrap');
  if (target) {
    const data = target.dataset;
    titleTag.value = data.title;
    dateTag.textContent = data.date;
    labelTag.value = data.label;
    contentTag.value = data.content;
    noteId = target.id;
    const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    noteModal.show();
  }
});

function showNotes() {
  document.querySelectorAll(".note-wrap").forEach((note) => note.remove());
  getDocs(queries)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let data = { ...doc.data(), id: doc.id};

        let divTag = `<div class="note-wrap col-6 col-xl-2 col-lg-3 col-md-4 m-3" 
                        id="${data.id}" 
                        data-title="${data.title}" 
                        data-date="${data.date}" 
                        data-label="${data.label}" 
                        data-content="${data.content}">
                          <div class="note card p-3">
                              <h5 class="card-title">${data.title}</h5>
                              <p class="card-date mb-2" style="font-size: 14px; color: #6A6A6A;">${data.date}</p>
                              <p class="card-text">${data.content}</p>
                          </div>
                      </div>`;

        document.querySelector('.background .row').innerHTML += divTag;
        if (window.location.href == "http://127.0.0.1:5500/dist/label.html") {
          checkLabel()
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
}

showNotes(); // tampilkan notes


updateBtn.addEventListener('click', (e) => {
  e.preventDefault();//it is used for not refreshing the website
  const docRef = window.location.href == "http://127.0.0.1:5500/dist/notes.html" ? doc(db, 'notes', noteId) : window.location.href == "http://127.0.0.1:5500/dist/notes.html" ? doc(db, 'archive', noteId) : doc(db, 'archive', noteId)
  updateDoc(docRef, {
    title:titleTag.value,
    label: labelTag.value,
    content: contentTag.value
  })
  .then(() => {
    document.querySelector(".modal-header .btn-close").click();
    showNotes();
  })
})



deleteBtn.addEventListener('click', (e) => {
  e.preventDefault();//it is used for not refreshing the website
  const docRef = doc(db, 'notes', noteId)
  deleteDoc(docRef)
  .then(() => {
    document.querySelector(".modal-header .btn-close").click();
    showNotes();
  })
})

