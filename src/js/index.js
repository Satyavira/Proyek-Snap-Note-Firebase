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
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZHi7zdcJZzJ9A5iumlHgsrwsTckvuIUk",
  authDomain: "snap-note-78cf6.firebaseapp.com",
  projectId: "snap-note-78cf6",
  storageBucket: "snap-note-78cf6.appspot.com",
  messagingSenderId: "64234586882",
  appId: "1:64234586882:web:126e081903de89312bf81b",
  measurementId: "G-M2DK03SK9B",
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

var noteId;

const colNotes = collection(db, "notes");
let queries = query(colNotes, orderBy("createdAt"));
const colArchive = collection(db, "archive");
var docArchive;

const googleVerification = document.querySelector(".login-with-google-btn");
const signUpForm = document.querySelector(".sign-up-form");
const loginForm = document.querySelector(".login-form");
const signout = document.querySelector(".sign-out");
const addNoteForm = document.getElementById("addNoteForm");
const updateBtn = document.querySelector(".update-btn");
const deleteBtn = document.querySelector(".delete-btn");
const archiveBtn = document.querySelector(".archive-btn");
const unarchiveBtn = document.querySelector(".unarchive-btn");
const settingButton = document.querySelectorAll(".settings");
const settingContainer = document.querySelectorAll(".setting-details");
const titleTag = document.querySelector(".modal-note-title");
const dateTag = document.querySelector(".modal-note-date");
const labelTag = document.querySelector(".modal-note-label");
const contentTag = document.querySelector(".modal-note-content");
const label = document.querySelector(".label");
const labelList = document.querySelector(".labelList");
let selectedLabel
let colRef

const handleGoogleVerification = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      window.location.href = "../html/notes.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const handleSignUpForm = (e, username, password, action) => {
  e.preventDefault();
  action(auth, username, password)
    .then((cred) => {
      console.log(`User ${cred.user.uid} created`);
      window.location.href = "../html/login.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const handleLoginForm = (e, username, password, action) => {
  e.preventDefault();
  action(auth, username, password)
    .then((cred) => {
      console.log(`User ${cred.user.id} logged in`);
      window.location.href = "../html/notes.html";
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getCurrentDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  let yyyy = today.getFullYear();

  return dd + "-" + mm + "-" + yyyy;
};

const showNotes = () => {
  document.querySelectorAll(".note-wrap").forEach((note) => note.remove());
  getDocs(queries)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let data = { ...doc.data(), id: doc.id };

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

        document.querySelector(".background .row").innerHTML += divTag;
        if (window.location.pathname === "src/html/label.html") {
          checkLabel();
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const updateLabelButton = () => {
  const labelButton = document.querySelector(".label");
  labelButton.innerText = selectedLabel;
};

const checkLabel = () => {
  getDocs(colRef)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let inside = { ...doc.data(), id: doc.id };
        if (!(inside.label in arrayOfLabel)) {
          arrayOfLabel.push(inside.label);
          let divTag = `<li><a class="dropdown-item" href="#">${inside.label}</a></li>`;
          labelList.innerHTML += divTag;
          console.log(labelList.innerHTML);
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

if (
  window.location.pathname === "/src/html/signup.html" ||
  window.location.pathname === "/src/html/login.html"
) {
  googleVerification.addEventListener("click", handleGoogleVerification);

  if (window.location.pathname === "/src/html/signup.html") {
    signUpForm.addEventListener("submit", (e) => {
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      handleSignUpForm(e, username, password, createUserWithEmailAndPassword);
    });
  } else {
    loginForm.addEventListener("submit", (e) => {
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      handleLoginForm(e, username, password, signInWithEmailAndPassword);
    });
  }
} else {
  signout.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "../html/index.html";
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
}

    // docArchive = doc(db, "archive", noteId);
//   });

if (window.location.pathname === "/src/html/notes.html") {
  showNotes();

  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let noteTitle = document.getElementById("floatingInput").value;
    console.log(noteTitle);
    let noteDate = getCurrentDate();
    let noteLabel = document.getElementById("floatingLabel").value;
    let noteContent = document.getElementById("floatingContent").value;
    if (noteTitle && noteContent) {
      addDoc(colNotes, {
        title: noteTitle,
        date: noteDate,
        createdAt: serverTimestamp(),
        label: noteLabel,
        content: noteContent,
      }).then(() => {
        addNoteForm.reset();
        showNotes();
      });
    }
  });

  archiveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const colRef = collection(db, "archive")
    deleteDoc(doc(colNotes, noteId)).then(() => {
      addDoc(colRef, {
        title: titleTag.value,
        date: dateTag.textContent,
        createdAt: serverTimestamp(),
        label: labelTag.value,
        content: contentTag.value,
      });
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    });
  });
} else if (window.location.pathname === "/src/html/archive.html") {
  colRef = collection(db, "archive")
  queries = query(colRef, orderBy("createdAt"))
  showNotes();
  unarchiveBtn.addEventListener("click", (e) => {
    const docArchive = doc(db, "archive", noteId);
    e.preventDefault();
    deleteDoc(docArchive).then(() => {
      addDoc(colNotes, {
        title: titleTag.value,
        date: dateTag.textContent,
        createdAt: serverTimestamp(),
        label: labelTag.value,
        content: contentTag.value,
      });
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    });
  });
} else if (window.location.pathname === "/src/html/labels.html") {
  var arrayOfLabel = [];
  colRef = collection(db, "notes")
  queries = query(colRef, where("label", "==", `${label.value}`));
  selectedLabel = "None";
  document
    .querySelector(".dropdown-menu.labelList")
    .addEventListener("click", (event) => {
      if (event.target.classList.contains("dropdown-item")) {
        selectedLabel = event.target.textContent;
        updateLabelButton();
        const value = selectedLabel != "None" ? selectedLabel : "";
        queries = query(colRef, where("label", "==", `${value}`));
        showNotes();
      }
    });

  updateLabelButton();
  checkLabel();
  showNotes();

  archiveBtn.addEventListener("click", (e) => {
    // e.preventDefault(); //it is used for not refreshing the website
    const colRef = collection(db, "archive");
    const docRef = doc(db, "notes", noteId);
    deleteDoc(docRef)
      .then(() => {
        addDoc(colRef, {
          title: titleTag.value,
          date: dateTag.textContent,
          createdAt: serverTimestamp(),
          label: labelTag.value,
          content: contentTag.value,
        });
        document.querySelector(".modal-header .btn-close").click();
        window.location.reload();
        // showNotes();
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
}

getDocs(colNotes)
  .then((snapshot) => {
    snapshot.docs.forEach((docu) => {
      let inside = { ...docu.data(), id: docu.id };
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

onSnapshot(queries, (snapshot) => {
  snapshot.docs.forEach((docu) => {
    let inside = { ...docu.data(), id: docu.id };
    // console.log(inside);
  });
});

if (window.location.pathname !== "/src/html/settings.html" && window.location.pathname !== "/src/html/login.html" && window.location.pathname !== "/src/html/signup.html") {
  document
  .querySelector(".background .row")
  .addEventListener("click", function (event) {
    const target = event.target.closest(".note-wrap");
    if (target) {
      const data = target.dataset;
      titleTag.value = data.title;
      dateTag.textContent = data.date;
      labelTag.value = data.label;
      contentTag.value = data.content;
      noteId = target.id; // Move the assignment here
      const noteModal = new bootstrap.Modal(
        document.getElementById("noteModal")
      );
      noteModal.show();
    }
  })
  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const docRef =
      window.location.pathname === "/src/html/notes.html"
        ? doc(db, "notes", noteId)
        : window.location.pathname === "/src/html/archive.html"
        ? doc(db, "archive", noteId)
        : doc(db, "notes", noteId);
    updateDoc(docRef, {
      title: titleTag.value,
      label: labelTag.value,
      content: contentTag.value,
    }).then(() => {
      document.querySelector(".modal-header .btn-close").click();
      if (window.location.pathname === "/src/html/labels.html") {
        window.location.reload();
      }
      showNotes();
    });
  });
  
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const docRef =
      window.location.pathname == "/src/html/notes.html"
        ? doc(db, "notes", noteId)
        : window.location.pathname == "/src/html/archive.html"
        ? doc(db, "archive", noteId)
        : doc(db, "notes", noteId);
    deleteDoc(docRef).then(() => {
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    });
  });
}

settingButton.forEach((element) => {
  element.addEventListener("click", () => {
    settingButton.forEach((elem) => {
      elem.classList.remove("active");
    });
    element.classList.add("active");
    let current = element.className;
    current = current.split(" ");
    current = current[2];

    settingContainer.forEach((el) => {
      el.classList.remove("inactive");
    });
    settingContainer.forEach((el) => {
      let el_class = el.className;
      el_class = el_class.split(" ");
      el_class.forEach((ele) => {
        if (current == ele) {
          el.classList.remove("inactive");
        } else {
          el.classList.add("inactive");
        }
      });
    });
  });
});
