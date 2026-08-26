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

```
// ==================================================
// ELEMENTLER
// ==================================================

const authOverlay =
    document.getElementById("authOverlay");

const authClose =
    document.getElementById("authClose");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginTopButton =
    document.querySelector(".login-button");

const signupTopButton =
    document.querySelector(".signup-button");


// ==================================================
// LOGIN MODAL
// ==================================================

function openLogin() {

    if (!authOverlay || !loginForm || !registerForm) {
        return;
    }

    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");

    authOverlay.classList.add("show");
}


// ==================================================
// REGISTER MODAL
// ==================================================

function openRegister() {

    if (!authOverlay || !loginForm || !registerForm) {
        return;
    }

    loginForm.classList.add("hidden");

    registerForm.classList.remove("hidden");

    authOverlay.classList.add("show");
}


// ==================================================
// ÜST BUTONLAR
// ==================================================

if (loginTopButton) {

    loginTopButton.addEventListener(
        "click",
        openLogin
    );

}


if (signupTopButton) {

    signupTopButton.addEventListener(
        "click",
        openRegister
    );

}


// ==================================================
// MODAL KAPAT
// ==================================================

if (authClose) {

    authClose.addEventListener(
        "click",
        () => {

            authOverlay.classList.remove("show");

        }
    );

}


if (authOverlay) {

    authOverlay.addEventListener(
        "click",
        event => {

            if (event.target === authOverlay) {

                authOverlay.classList.remove("show");

            }

        }
    );

}


// ==================================================
// LOGIN / REGISTER GEÇİŞ
// ==================================================

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");


if (showRegister) {

    showRegister.addEventListener(
        "click",
        openRegister
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        openLogin
    );

}


// ==================================================
// KAYIT OL
// ==================================================

const registerButton =
    document.getElementById("registerButton");


if (registerButton) {

    registerButton.addEventListener(
        "click",
        async () => {

            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const message =
                document.getElementById("registerMessage");


            if (!username) {

                message.style.color = "#d14b58";

                message.textContent =
                    "Kullanıcı adı gir.";

                return;
            }


            if (!email) {

                message.style.color = "#d14b58";

                message.textContent =
                    "E-posta adresi gir.";

                return;
            }


            if (password.length < 6) {

                message.style.color = "#d14b58";

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
                    doc(
                        db,
                        "users",
                        result.user.uid
                    ),
                    {

                        uid: result.user.uid,

                        username: username,

                        email: email,

                        bio: "",

                        followers: 0,

                        following: 0,

                        posts: 0,

                        createdAt:
                            serverTimestamp()

                    }
                );


                message.style.color =
                    "#3c8a67";

                message.textContent =
                    "Hesabın başarıyla oluşturuldu!";


                setTimeout(
                    () => {

                        if (authOverlay) {

                            authOverlay.classList.remove(
                                "show"
                            );

                        }

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Kayıt hatası:",
                    error
                );


                message.style.color =
                    "#d14b58";


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

                } else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message.textContent =
                        "Şifre çok zayıf.";

                } else {

                    message.textContent =
                        "Kayıt sırasında hata oluştu.";

                }


            } finally {

                registerButton.disabled =
                    false;

                registerButton.textContent =
                    "Hesap Oluştur";

            }

        }
    );

}


// ==================================================
// GİRİŞ YAP
// ==================================================

const loginButton =
    document.getElementById("loginButton");


if (loginButton) {

    loginButton.addEventListener(
        "click",
        async () => {

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const message =
                document.getElementById("loginMessage");


            if (!email || !password) {

                message.style.color =
                    "#d14b58";

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


                message.style.color =
                    "#3c8a67";

                message.textContent =
                    "Giriş başarılı!";


                setTimeout(
                    () => {

                        if (authOverlay) {

                            authOverlay.classList.remove(
                                "show"
                            );

                        }

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Giriş hatası:",
                    error
                );


                message.style.color =
                    "#d14b58";

                message.textContent =
                    "E-posta veya şifre hatalı.";

            } finally {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Giriş Yap";

            }

        }
    );

}


// ==================================================
// FIREBASE OTURUM KONTROLÜ
// ==================================================

onAuthStateChanged(
    auth,
    async user => {

        const topRight =
            document.querySelector(".top-right");


        if (!topRight) {
            return;
        }


        if (user) {

            let username =
                user.email || "Kullanıcı";


            try {

                const userDoc =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


                if (userDoc.exists()) {

                    const data =
                        userDoc.data();


                    username =
                        data.username ||
                        user.email;

                }

            } catch (error) {

                console.error(
                    "Profil bilgisi alınamadı:",
                    error
                );

            }


            // ==================================================
            // GİRİŞ YAPMIŞ KULLANICI
            // ==================================================

            topRight.innerHTML = `

                <span class="logged-user">
                    @${username}
                </span>

                <button
                    class="profile-button"
                    id="topProfileButton"
                >
                    Profil
                </button>

                <button
                    class="logout-button"
                    id="logoutButton"
                >
                    Çıkış
                </button>

            `;


            // ==================================================
            // ÇIKIŞ
            // ==================================================

            const logoutButton =
                document.getElementById(
                    "logoutButton"
                );


            if (logoutButton) {

                logoutButton.addEventListener(
                    "click",
                    async () => {

                        try {

                            await signOut(auth);

                            location.reload();

                        } catch (error) {

                            console.error(
                                "Çıkış hatası:",
                                error
                            );

                        }

                    }
                );

            }


            // ==================================================
            // ÜST PROFİL BUTONU
            // ==================================================

            const topProfileButton =
                document.getElementById(
                    "topProfileButton"
                );


            if (topProfileButton) {

                topProfileButton.addEventListener(
                    "click",
                    () => {

                        openProfile();

                    }
                );

            }


            // ==================================================
            // PROFİL BİLGİLERİNİ DOLDUR
            // ==================================================

            loadProfile(
                user,
                username
            );


        } else {

            // ==================================================
            // ÇIKIŞ YAPMIŞ KULLANICI
            // ==================================================

            topRight.innerHTML = `

                <button class="login-button">
                    Giriş Yap
                </button>

                <button class="signup-button">
                    Kayıt Ol
                </button>

            `;


            const newLogin =
                topRight.querySelector(
                    ".login-button"
                );

            const newSignup =
                topRight.querySelector(
                    ".signup-button"
                );


            if (newLogin) {

                newLogin.addEventListener(
                    "click",
                    openLogin
                );

            }


            if (newSignup) {

                newSignup.addEventListener(
                    "click",
                    openRegister
                );

            }

        }

    }
);


// ==================================================
// PROFİL SAYFASI
// ==================================================

const sidebarProfile =
    document.getElementById(
        "sidebarProfile"
    );


function openProfile() {

    const appShell =
        document.querySelector(
            ".app-shell"
        );

    const profilePage =
        document.getElementById(
            "profilePage"
        );


    if (!profilePage) {

        console.error(
            "profilePage bulunamadı."
        );

        return;
    }


    if (appShell) {

        appShell.style.display =
            "none";

    }


    profilePage.style.display =
        "block";

    profilePage.classList.add(
        "show"
    );


    window.scrollTo(
        0,
        0
    );

}


if (sidebarProfile) {

    sidebarProfile.addEventListener(
        "click",
        event => {

            event.preventDefault();

            openProfile();

        }
    );

}


// ==================================================
// PROFİL VERİLERİ
// ==================================================

async function loadProfile(
    user,
    username
) {

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileUsername =
        document.getElementById(
            "profileUsername"
        );

    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    if (profileName) {

        profileName.textContent =
            username;

    }


    if (profileUsername) {

        profileUsername.textContent =
            "@" + username;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            username
                .charAt(0)
                .toUpperCase();

    }


    try {

        const userDoc =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid
                )
            );


        if (
            userDoc.exists()
        ) {

            const data =
                userDoc.data();


            const bio =
                document.getElementById(
                    "profileBio"
                );

            const followerCount =
                document.getElementById(
                    "followerCount"
                );

            const followingCount =
                document.getElementById(
                    "followingCount"
                );

            const postCount =
                document.getElementById(
                    "postCount"
                );


            if (bio) {

                bio.textContent =
                    data.bio ||
                    "Henüz bir bio eklenmemiş.";

            }


            if (followerCount) {

                followerCount.textContent =
                    data.followers || 0;

            }


            if (followingCount) {

                followingCount.textContent =
                    data.following || 0;

            }


            if (postCount) {

                postCount.textContent =
                    data.posts || 0;

            }

        }

    } catch (error) {

        console.error(
            "Profil yükleme hatası:",
            error
        );

    }

}


// ==================================================
// BEĞENİ
// ==================================================

const likeButtons =
    document.querySelectorAll(
        ".like-action"
    );


likeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const icon =
                    button.querySelector(
                        "span"
                    );


                if (
                    button.classList.contains(
                        "liked-post"
                    )
                ) {

                    button.classList.remove(
                        "liked-post"
                    );

                    icon.textContent =
                        "♡";

                } else {

                    button.classList.add(
                        "liked-post"
                    );

                    icon.textContent =
                        "♥";

                }

            }
        );

    }
);


// ==================================================
// TAKİP
// ==================================================

const followButtons =
    document.querySelectorAll(
        ".suggestion button"
    );


followButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

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

            }
        );

    }
);


// ==================================================
// ARAMA
// ==================================================

const searchInput =
    document.querySelector(
        ".global-search input"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

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


// ==================================================
// GÖNDERİ
// ==================================================

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
```

});
