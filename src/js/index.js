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

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL1QjE7nA-pMY8Nyz_p5D7ysGALpnonqc",
  authDomain: "snapnote-eef4b.firebaseapp.com",
  projectId: "snapnote-eef4b",
  storageBucket: "snapnote-eef4b.appspot.com",
  messagingSenderId: "1080598009363",
  appId: "1:1080598009363:web:72419cd59277a5723311e6",
  measurementId: "G-1ZWJWBWT8T"
};

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

var noteId;

const colNotes = collection(db, "notes");
const currentUser = collection(db, "current")
// const colArchive = collection(db, "archive");
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
const welcome = document.querySelector(".welcome");
const archive = document.querySelector(".archive-welcome")
const labelWelcome = document.querySelector(".label-welcome")
const date = document.querySelector(".date")
const username = document.querySelector(".username");
const myUsername = document.querySelector(".userName");
const picture = document.querySelectorAll(".rounded-circle")
const emailSetting = document.querySelector(".email")
const inputPassword = document.querySelector("passwordUser")
const changePassword = document.querySelector("change-password")
let selectedLabel
let colRef
let userId
let queries = query(colNotes, where("userId","==",`${userId}`), orderBy("createdAt"));

const handleGoogleVerification = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      window.location.href = "https://snapnote-eef4b.web.app/html/notes.html";
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
      window.location.href = "https://snapnote-eef4b.web.app/html/login.html";
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
      window.location.href = "https://snapnote-eef4b.web.app/html/notes.html";
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

// fungsi untuk mendapatkan tanggal dan hari sekarang
function getCurrentDateAndDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const now = new Date();
    const dayOfWeek = days[now.getDay()];
    const month = months[now.getMonth()];
  
    const date = now.getDate();
    const year = now.getFullYear();
  
    return `${dayOfWeek}, ${date} ${month} ${year}`;
}

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

const checkLabel = async () => {
  await getDocs(colRef)
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        let inside = { ...doc.data(), id: doc.id };
        if (!(inside.label in arrayOfLabel) && inside.label !== "" && inside.userId === userId) {
          arrayOfLabel.push(inside.label);
          let divTag = `<li><a class="dropdown-item" href="#">${inside.label}</a></li>`;
          if (arrayOfLabel.length == 1) {
            labelList.innerHTML = divTag;
            selectedLabel = inside.label != "" ? inside.label : "None";
            updateLabelButton();
          }
          else {
            labelList.innerHTML += divTag
          }
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
    queries = query(colNotes, where("userId","==",`${userId}`), where("label", "==", `${label.textContent !== "None" ? label.textContent : ""}`));
    showNotes();
};

// if (window.location.href !== "/src/html/login.html" && window.location.href !== "/src/html/signup.html" && window.location.href !== "/src/html/index.html") {
//   const user = auth;
//   console.log(user)
//   if (user != null) {
//     // The user object has basic properties such as display name, email, etc.
//     console.log("HHEH")
//     const displayName = user.displayName;
//     const email = user.email;
//     const photoURL = user.photoURL;
//     const emailVerified = user.emailVerified;
//     welcome.innerText = `Welcome Back, ${displayName}!`
//     username.innerText = displayName
//     picture.src = photoURL
//     emailSetting.innerText = email
//     // The user's ID, unique to the Firebase project. Do NOT use
//     // this value to authenticate with your backend server, if
//     // you have one. Use User.getToken() instead.
//     userId = user.uid;
//     console.log(user.toJSON)
//   }
// }

auth.onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    userId = user.uid
    // console.log(user.uid);
    showNotes()
      //     // The user object has basic properties such as display name, email, etc.
      //     console.log("HHEH")
    const displayName = user.displayName != undefined ? user.displayName : user.email.split('@')[0].charAt(0).toUpperCase()+user.email.split('@')[0].slice(1);
    const email = user.email;
    const photoURL = user.photoURL != undefined ? user.photoURL : photoURL("../img/profile picture.png");
    const emailVerified = user.emailVerified;
    if (window.location.href !== "https://snapnote-eef4b.web.app/html/settings.html") {
      if (window.location.href == "https://snapnote-eef4b.web.app/html/notes.html") {
        welcome.innerText = `Welcome Back, ${displayName}!`
        queries = query(colNotes, where("userId","==",`${userId}`), orderBy("createdAt"));
      }
      else if (window.location.href == "https://snapnote-eef4b.web.app/html/archive.html") {
        archive.innerText = `Welcome to Archive, ${displayName}!`
        queries = query(colRef, where("userId","==",`${userId}`), orderBy("createdAt"))
      } else {
        labelWelcome.innerText = `Welcome to Labels, ${displayName}!`
      }
      date.innerText = getCurrentDateAndDay()
    }
    else {
      emailSetting.innerText = email
      myUsername.innerText = displayName != undefined ? displayName : user.email.split('@')[0].charAt(0).toUpperCase()+user.email.split('@')[0].slice(1)
      // changePassword.addEventListener("click", () => {
      //   user.updatePassword(inputPassword.value)
      //   .then(() => {
      //     console.log("Update Succesfull")
      //   })
      //   .catch((err) => {
      //     console.log(err.message)
      //   })
      // })
    }
    showNotes()
    username.innerText = displayName != undefined ? displayName : user.email.split('@')[0].charAt(0).toUpperCase()+user.email.split('@')[0].slice(1)
    picture.forEach((pic) => {
      pic.src = photoURL
    })
      //     // The user's ID, unique to the Firebase project. Do NOT use
      //     // this value to authenticate with your backend server, if
      //     // you have one. Use User.getToken() instead.
      //     userId = user.uid;
      //     console.log(user.toJSON)
      //   }
  } else {
    // User not logged in or has just logged out.
  }
});

if (
  window.location.href == "https://snapnote-eef4b.web.app/html/signup.html" ||
  window.location.href == "https://snapnote-eef4b.web.app/html/login.html"
) {
  googleVerification.addEventListener("click", handleGoogleVerification);

  if (window.location.href == "https://snapnote-eef4b.web.app/html/signup.html") {
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
        window.location.href = "https://snapnote-eef4b.web.app/";
      })
      .catch((err) => {
        console.log(err.message);
      });
  });
}

    // docArchive = doc(db, "archive", noteId);
//   });

if (window.location.href == "https://snapnote-eef4b.web.app/html/notes.html") {
  showNotes();

  addNoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let noteTitle = document.getElementById("floatingInput").value;
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
        userId: userId
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
        userId: userId
      });
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    });
  });
} else if (window.location.href == "https://snapnote-eef4b.web.app/html/archive.html") {
  colRef = collection(db, "archive")
  queries = query(colRef, where("userId","==",`${userId}`), orderBy("createdAt"))
  showNotes();
  document
  .querySelector(".dropdown-menu.labelList")
  .addEventListener("click", (event) => {
      if (event.target.classList.contains("dropdown-item")) {
        selectedLabel = event.target.textContent;
        updateLabelButton();
        const value = selectedLabel != "None" ? selectedLabel : "";
        if (value == "Alphabet") {
          queries = query(colRef, where("userId","==",`${userId}`), orderBy("title"));
        }
        else {
          queries = query(colRef, where("userId","==",`${userId}`), orderBy("createdAt"))
        }
        showNotes();
      }
    });
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
        userId: userId
      });
      document.querySelector(".modal-header .btn-close").click();
      showNotes();
    });
  });
} else if (window.location.href == "https://snapnote-eef4b.web.app/html/labels.html") {
  var arrayOfLabel = [];
  colRef = collection(db, "notes")
  selectedLabel = "None";
  document
  .querySelector(".dropdown-menu.labelList")
  .addEventListener("click", (event) => {
      if (event.target.classList.contains("dropdown-item")) {
        selectedLabel = event.target.textContent;
        updateLabelButton();
        const value = selectedLabel != "None" ? selectedLabel : "";
        queries = query(colRef, where("userId","==",`${userId}`), where("label", "==", `${value}`), orderBy("createdAt"));
        showNotes();
      }
    });
    
  updateLabelButton();
  checkLabel();

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
          userId: userId
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

if (window.location.href !== "https://snapnote-eef4b.web.app/html/settings.html" && window.location.href !== "https://snapnote-eef4b.web.app/html/login.html" && window.location.href !== "https://snapnote-eef4b.web.app/html/signup.html") {
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
      window.location.href == "https://snapnote-eef4b.web.app/html/notes.html"
        ? doc(db, "notes", noteId)
        : window.location.href == "https://snapnote-eef4b.web.app/html/archive.html"
        ? doc(db, "archive", noteId)
        : doc(db, "notes", noteId);
    updateDoc(docRef, {
      title: titleTag.value,
      label: labelTag.value,
      content: contentTag.value,
    }).then(() => {
      document.querySelector(".modal-header .btn-close").click();
      if (window.location.href == "https://snapnote-eef4b.web.app/html/labels.html") {
        window.location.reload();
      }
      showNotes();
    });
  });
  
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const docRef =
      window.location.href == "https://snapnote-eef4b.web.app/html/notes.html"
        ? doc(db, "notes", noteId)
        : window.location.href == "https://snapnote-eef4b.web.app/html/archive.html"
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