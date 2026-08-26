import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {


    // =========================
    // AUTH ELEMENTS
    // =========================

    const authOverlay = document.getElementById("authOverlay");

    const authClose = document.getElementById("authClose");

    const loginForm = document.getElementById("loginForm");

    const registerForm = document.getElementById("registerForm");

    const loginTopButton =
        document.querySelector(".login-button");

    const signupTopButton =
        document.querySelector(".signup-button");


    // =========================
    // OPEN LOGIN
    // =========================

    if (loginTopButton) {

        loginTopButton.addEventListener("click", () => {

            loginForm.classList.remove("hidden");

            registerForm.classList.add("hidden");

            authOverlay.classList.add("show");

        });

    }


    // =========================
    // OPEN REGISTER
    // =========================

    if (signupTopButton) {

        signupTopButton.addEventListener("click", () => {

            loginForm.classList.add("hidden");

            registerForm.classList.remove("hidden");

            authOverlay.classList.add("show");

        });

    }


    // =========================
    // CLOSE
    // =========================

    if (authClose) {

        authClose.addEventListener("click", () => {

            authOverlay.classList.remove("show");

        });

    }


    if (authOverlay) {

        authOverlay.addEventListener("click", event => {

            if (event.target === authOverlay) {

                authOverlay.classList.remove("show");

            }

        });

    }


    // =========================
    // LOGIN / REGISTER SWITCH
    // =========================

    const showRegister =
        document.getElementById("showRegister");

    const showLogin =
        document.getElementById("showLogin");


    if (showRegister) {

        showRegister.addEventListener("click", () => {

            loginForm.classList.add("hidden");

            registerForm.classList.remove("hidden");

        });

    }


    if (showLogin) {

        showLogin.addEventListener("click", () => {

            registerForm.classList.add("hidden");

            loginForm.classList.remove("hidden");

        });

    }


    // =========================
    // REGISTER
    // =========================

    const registerButton =
        document.getElementById("registerButton");


    if (registerButton) {

        registerButton.addEventListener("click", async () => {

            const username =
                document.getElementById("registerUsername")
                .value
                .trim();

            const email =
                document.getElementById("registerEmail")
                .value
                .trim();

            const password =
                document.getElementById("registerPassword")
                .value;

            const message =
                document.getElementById("registerMessage");


            if (!username) {

                message.textContent =
                    "Kullanıcı adı gir.";

                return;

            }


            if (password.length < 6) {

                message.textContent =
                    "Şifre en az 6 karakter olmalı.";

                return;

            }


            try {

                registerButton.disabled = true;

                registerButton.textContent =
                    "Oluşturuluyor...";


                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                await setDoc(
                    doc(db, "users", result.user.uid),
                    {

                        uid: result.user.uid,

                        username: username,

                        email: email,

                        createdAt: serverTimestamp(),

                        followers: 0,

                        following: 0,

                        bio: ""

                    }
                );


                message.style.color = "#3c8a67";

                message.textContent =
                    "Hesabın oluşturuldu!";


                setTimeout(() => {

                    authOverlay.classList.remove("show");

                }, 1000);


            } catch (error) {

                console.error(error);

                message.style.color = "#d14b58";

                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message.textContent =
                        "Bu e-posta zaten kullanılıyor.";

                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message.textContent =
                        "Geçerli bir e-posta gir.";

                } else {

                    message.textContent =
                        "Kayıt sırasında hata oluştu.";

                }

            } finally {

                registerButton.disabled = false;

                registerButton.textContent =
                    "Hesap Oluştur";

            }

        });

    }


    // =========================
    // LOGIN
    // =========================

    const loginButton =
        document.getElementById("loginButton");


    if (loginButton) {

        loginButton.addEventListener("click", async () => {

            const email =
                document.getElementById("loginEmail")
                .value
                .trim();

            const password =
                document.getElementById("loginPassword")
                .value;

            const message =
                document.getElementById("loginMessage");


            if (!email || !password) {

                message.textContent =
                    "E-posta ve şifre gerekli.";

                return;

            }


            try {

                loginButton.disabled = true;

                loginButton.textContent =
                    "Giriş yapılıyor...";


                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                message.style.color = "#3c8a67";

                message.textContent =
                    "Giriş başarılı!";


                setTimeout(() => {

                    authOverlay.classList.remove("show");

                }, 700);


            } catch (error) {

                console.error(error);

                message.style.color = "#d14b58";

                message.textContent =
                    "E-posta veya şifre hatalı.";

            } finally {

                loginButton.disabled = false;

                loginButton.textContent =
                    "Giriş Yap";

            }

        });

    }


    // =========================
    // FIREBASE USER
    // =========================

  onAuthStateChanged(auth, async user => {

    const topRight =
        document.querySelector(".top-right");

    if (!topRight) return;


    if (user) {

        let username = user.email;

        try {

            const userDoc = await getDoc(
                doc(db, "users", user.uid)
            );

            if (userDoc.exists()) {

                username =
                    userDoc.data().username ||
                    user.email;

            }

        } catch (error) {

            console.error(error);

        }


        topRight.innerHTML = `

            <span class="logged-user">
                @${username}
            </span>

            <button class="profile-button">
                Profil
            </button>

            <button class="logout-button">
                Çıkış
            </button>

        `;


        const logoutButton =
            document.querySelector(".logout-button");


        logoutButton.addEventListener(
            "click",
            async () => {

                await signOut(auth);

                location.reload();

            }
        );


        console.log(
            "ARKİLER giriş yaptı:",
            username
        );


    } else {

        topRight.innerHTML = `

            <button class="login-button">
                Giriş Yap
            </button>

            <button class="signup-button">
                Kayıt Ol
            </button>

        `;


        const newLogin =
            document.querySelector(".login-button");

        const newSignup =
            document.querySelector(".signup-button");


        newLogin.addEventListener(
            "click",
            () => {

                loginForm.classList.remove("hidden");

                registerForm.classList.add("hidden");

                authOverlay.classList.add("show");

            }
        );


        newSignup.addEventListener(
            "click",
            () => {

                loginForm.classList.add("hidden");

                registerForm.classList.remove("hidden");

                authOverlay.classList.add("show");

            }
        );

    }

});


    // =========================
    // LIKE
    // =========================

    const likeButtons =
        document.querySelectorAll(".like-action");


    likeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const icon =
                button.querySelector("span");


            if (
                button.classList.contains("liked-post")
            ) {

                button.classList.remove("liked-post");

                icon.textContent = "♡";

            } else {

                button.classList.add("liked-post");

                icon.textContent = "♥";

            }

        });

    });


    // =========================
    // FOLLOW
    // =========================

    const followButtons =
        document.querySelectorAll(
            ".suggestion button"
        );


    followButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (
                button.textContent.trim() ===
                "Takip"
            ) {

                button.textContent =
                    "Takiptesin";

                button.style.background =
                    "#eeeeff";

                button.style.color =
                    "#5b5ce2";

            } else {

                button.textContent =
                    "Takip";

                button.style.background =
                    "#15171a";

                button.style.color =
                    "white";

            }

        });

    });


    // =========================
    // SEARCH
    // =========================

    const searchInput =
        document.querySelector(
            ".global-search input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    const value =
                        searchInput.value.trim();

                    if (value !== "") {

                        alert(
                            "Arama sistemi yakında aktif olacak."
                        );

                    }

                }

            }
        );

    }


    // =========================
    // POST
    // =========================

    const publishButton =
        document.querySelector(
            ".publish-button"
        );

    const composerInput =
        document.querySelector(
            ".composer-input"
        );


    if (publishButton) {

        publishButton.addEventListener(
            "click",
            () => {

                alert(
                    "Gönderi paylaşmak için önce giriş yapmalısın."
                );

            }
        );

    }


    if (composerInput) {

        composerInput.addEventListener(
            "click",
            () => {

                alert(
                    "Gönderi paylaşmak için önce giriş yapmalısın."
                );

            }
        );

    }


});

const sidebarProfile =
    document.getElementById("sidebarProfile");

const sidebarProfile =
    document.getElementById("sidebarProfile");

if (sidebarProfile) {

    sidebarProfile.addEventListener("click", event => {

        event.preventDefault();

        const appShell =
            document.querySelector(".app-shell");

        const profilePage =
            document.getElementById("profilePage");

        if (!appShell || !profilePage) {
            return;
        }

        appShell.style.display = "none";

        profilePage.classList.add("show");

    });

}
