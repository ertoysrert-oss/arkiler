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
    deleteDoc,
    serverTimestamp,
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {


// ==================================================
// ELEMENTLER
// ==================================================

const authOverlay = document.getElementById("authOverlay");
const authClose = document.getElementById("authClose");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTopButton = document.querySelector(".login-button");
const signupTopButton = document.querySelector(".signup-button");


// ==================================================
// LOGIN
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
// REGISTER
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
// ÜST GİRİŞ / KAYIT BUTONLARI
// ==================================================

if (loginTopButton) {
    loginTopButton.addEventListener("click", openLogin);
}

if (signupTopButton) {
    signupTopButton.addEventListener("click", openRegister);
}


// ==================================================
// MODAL KAPAT
// ==================================================

if (authClose) {

    authClose.addEventListener("click", () => {

        if (authOverlay) {
            authOverlay.classList.remove("show");
        }

    });

}


if (authOverlay) {

    authOverlay.addEventListener("click", event => {

        if (event.target === authOverlay) {
            authOverlay.classList.remove("show");
        }

    });

}


// ==================================================
// LOGIN / REGISTER GEÇİŞ
// ==================================================

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");


if (showRegister) {
    showRegister.addEventListener("click", openRegister);
}


if (showLogin) {
    showLogin.addEventListener("click", openLogin);
}


// ==================================================
// KAYIT OL
// ==================================================

const registerButton =
    document.getElementById("registerButton");


if (registerButton) {

    registerButton.addEventListener("click", async () => {

        const username =
            document.getElementById("registerUsername")
                ?.value.trim();

        const email =
            document.getElementById("registerEmail")
                ?.value.trim();

        const password =
            document.getElementById("registerPassword")
                ?.value;

        const message =
            document.getElementById("registerMessage");


        if (!username) {

            message.textContent =
                "Kullanıcı adı gir.";

            message.style.color =
                "#d14b58";

            return;
        }


        if (!email) {

            message.textContent =
                "E-posta adresi gir.";

            message.style.color =
                "#d14b58";

            return;
        }


        if (!password || password.length < 6) {

            message.textContent =
                "Şifre en az 6 karakter olmalı.";

            message.style.color =
                "#d14b58";

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
                    bio: "",
                    followers: 0,
                    following: 0,
                    posts: 0,
                    createdAt: serverTimestamp()
                }
            );


            message.style.color =
                "#3c8a67";

            message.textContent =
                "Hesabın başarıyla oluşturuldu!";


            setTimeout(() => {

                if (authOverlay) {
                    authOverlay.classList.remove("show");
                }

            }, 1000);


        } catch (error) {

            console.error("Kayıt hatası:", error);

            message.style.color =
                "#d14b58";


            if (error.code === "auth/email-already-in-use") {

                message.textContent =
                    "Bu e-posta zaten kullanılıyor.";

            } else if (error.code === "auth/invalid-email") {

                message.textContent =
                    "Geçerli bir e-posta gir.";

            } else if (error.code === "auth/weak-password") {

                message.textContent =
                    "Şifre çok zayıf.";

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


// ==================================================
// GİRİŞ YAP
// ==================================================

const loginButton =
    document.getElementById("loginButton");


if (loginButton) {

    loginButton.addEventListener("click", async () => {

        const email =
            document.getElementById("loginEmail")
                ?.value.trim();

        const password =
            document.getElementById("loginPassword")
                ?.value;

        const message =
            document.getElementById("loginMessage");


        if (!email || !password) {

            message.textContent =
                "E-posta ve şifre gerekli.";

            message.style.color =
                "#d14b58";

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


            setTimeout(() => {

                if (authOverlay) {
                    authOverlay.classList.remove("show");
                }

            }, 700);


        } catch (error) {

            console.error("Giriş hatası:", error);

            message.style.color =
                "#d14b58";

            message.textContent =
                "E-posta veya şifre hatalı.";

        } finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Giriş Yap";

        }

    });

}


// ==================================================
// PROFİLİ AÇ
// ==================================================

function openProfile() {

    const appShell =
        document.querySelector(".app-shell");

    const profilePage =
        document.getElementById("profilePage");


    if (!profilePage) {

        console.error(
            "HATA: profilePage HTML içinde bulunamadı."
        );

        return;
    }


    if (appShell) {
        appShell.style.display = "none";
    }


    profilePage.style.display = "block";

    profilePage.classList.add("show");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==================================================
// ANA MENÜ PROFİL
// ==================================================

const sidebarProfile =
    document.getElementById("sidebarProfile");


if (sidebarProfile) {

    sidebarProfile.addEventListener("click", event => {

        event.preventDefault();

        openProfile();

    });

}


// ==================================================
// FIREBASE OTURUM KONTROLÜ
// ==================================================

onAuthStateChanged(auth, async user => {

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
                    doc(db, "users", user.uid)
                );


            if (userDoc.exists()) {

                const data =
                    userDoc.data();

                username =
                    data.username ||
                    user.email ||
                    "Kullanıcı";

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
        // PROFİL BUTONU
        // ==================================================

        const topProfileButton =
            document.getElementById(
                "topProfileButton"
            );


        if (topProfileButton) {

            topProfileButton.addEventListener(
                "click",
                openProfile
            );

        }


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
        // PROFİL BİLGİLERİNİ YÜKLE
        // ==================================================

        loadProfile(
            user,
            username
        );


    } else {

        // ==================================================
        // ÇIKIŞ YAPMIŞ
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

});


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
                doc(db, "users", user.uid)
            );


        if (!userDoc.exists()) {
            return;
        }


        const data =
            userDoc.data();


        const profileBio =
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


        if (profileBio) {

            profileBio.textContent =
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

    } catch (error) {

        console.error(
            "Profil yükleme hatası:",
            error
        );

    }

}


// ==================================================
// GERÇEK BEĞENİ SİSTEMİ
// ==================================================

async function toggleLike(button) {

    const user = auth.currentUser;

    if (!user) {

        openLogin();

        return;
    }


    const postElement =
        button.closest(".post");

    if (!postElement) return;


    const postId =
        postElement.dataset.postId;

    if (!postId) {

        console.error(
            "Gönderi ID bulunamadı."
        );

        return;
    }


    const icon =
        button.querySelector("span");


    const countElement =
        postElement.querySelector(
            ".like-count"
        );


    if (!icon) return;


    // Her kullanıcı + gönderi için benzersiz ID
    const likeId =
        `${user.uid}_${postId}`;


    const likeRef =
        doc(
            db,
            "likes",
            likeId
        );


    try {

        const likeDoc =
            await getDoc(likeRef);


        if (likeDoc.exists()) {

            // =========================
            // BEĞENİYİ KALDIR
            // =========================

            await deleteDoc(likeRef);


            button.classList.remove(
                "liked-post"
            );

            icon.textContent =
                "♡";


            if (countElement) {

                const currentCount =
                    parseInt(
                        countElement.textContent
                    ) || 0;

                countElement.textContent =
                    Math.max(
                        0,
                        currentCount - 1
                    );

            }


        } else {

            // =========================
            // BEĞEN
            // =========================

            await setDoc(
                likeRef,
                {

                    uid:
                        user.uid,

                    postId:
                        postId,

                    createdAt:
                        serverTimestamp()

                }
            );


            button.classList.add(
                "liked-post"
            );

            icon.textContent =
                "♥";


            if (countElement) {

                const currentCount =
                    parseInt(
                        countElement.textContent
                    ) || 0;

                countElement.textContent =
                    currentCount + 1;

            }

        }

    } catch (error) {

        console.error(
            "Beğeni işlemi başarısız:",
            error
        );

    }

}


// ==================================================
// TAKİP
// ==================================================

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


// ==================================================
// GÖNDERİ OLUŞTURMA
// ==================================================

const publishButton =
    document.querySelector(".publish-button");

const composerInput =
    document.querySelector(".composer-input");

const postOverlay =
    document.getElementById("postOverlay");

const postClose =
    document.getElementById("postClose");

const postText =
    document.getElementById("postText");

const postSubmitButton =
    document.getElementById("postSubmitButton");

const postMessage =
    document.getElementById("postMessage");

const postCharCount =
    document.getElementById("postCharCount");

const postModalUser =
    document.getElementById("postModalUser");


// ==================================================
// GÖNDERİ PENCERESİNİ AÇ
// ==================================================

function openPostModal() {

    if (!auth.currentUser) {

        openLogin();

        return;
    }

    if (!postOverlay) return;

    postOverlay.classList.add("show");

    postText.value = "";

    postMessage.textContent = "";

    postCharCount.textContent = "0 / 1000";

    const currentUser =
        auth.currentUser;

    postModalUser.textContent =
        currentUser.email || "@kullanıcı";

    setTimeout(() => {

        postText.focus();

    }, 100);

}


// ==================================================
// PENCEREYİ KAPAT
// ==================================================

function closePostModal() {

    if (!postOverlay) return;

    postOverlay.classList.remove("show");

}


// ==================================================
// COMPOSER TIKLAMA
// ==================================================

if (composerInput) {

    composerInput.addEventListener(
        "click",
        openPostModal
    );

}


// ==================================================
// PAYLAŞ BUTONU
// ==================================================

if (publishButton) {

    publishButton.addEventListener(
        "click",
        openPostModal
    );

}


// ==================================================
// KAPAT
// ==================================================

if (postClose) {

    postClose.addEventListener(
        "click",
        closePostModal
    );

}


if (postOverlay) {

    postOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target === postOverlay
            ) {

                closePostModal();

            }

        }
    );

}


// ==================================================
// KARAKTER SAYACI
// ==================================================

if (postText) {

    postText.addEventListener(
        "input",
        () => {

            postCharCount.textContent =
                `${postText.value.length} / 1000`;

        }
    );

}


// ==================================================
// GÖNDERİYİ FIRESTORE'A KAYDET
// ==================================================

if (postSubmitButton) {

    postSubmitButton.addEventListener(
        "click",
        async () => {

            const text =
                postText.value.trim();


            if (!auth.currentUser) {

                postMessage.textContent =
                    "Gönderi paylaşmak için giriş yapmalısın.";

                return;

            }


            if (!text) {

                postMessage.textContent =
                    "Gönderi metni boş olamaz.";

                return;

            }


            try {

                postSubmitButton.disabled =
                    true;

                postSubmitButton.textContent =
                    "Paylaşılıyor...";


                const user =
                    auth.currentUser;


                const userDoc =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


                let username =
                    user.email || "Kullanıcı";


                if (userDoc.exists()) {

                    const data =
                        userDoc.data();

                    username =
                        data.username ||
                        username;

                }


                // Şimdilik benzersiz gönderi ID'si
                const postId =
                    crypto.randomUUID();


                await setDoc(
                    doc(
                        db,
                        "posts",
                        postId
                    ),
                    {

                        postId: postId,

                        uid: user.uid,

                        username: username,

                        text: text,

                        likes: 0,

                        comments: 0,

                        createdAt:
                            serverTimestamp()

                    }
                );


                postMessage.style.color =
                    "#3c8a67";

                postMessage.textContent =
                    "Gönderin başarıyla paylaşıldı!";


                postText.value = "";

                postCharCount.textContent =
                    "0 / 1000";


                setTimeout(
                    () => {

                        closePostModal();

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Gönderi paylaşma hatası:",
                    error
                );

                postMessage.style.color =
                    "#d14b58";

                postMessage.textContent =
                    "Gönderi paylaşılırken hata oluştu.";

            } finally {

                postSubmitButton.disabled =
                    false;

                postSubmitButton.textContent =
                    "Paylaş";

            }

        }
    );

}



});

/* ==================================================
PROFİL DÜZENLEME
================================================== */

const editProfileButton =
document.getElementById("editProfileButton");

const profileEditOverlay =
document.getElementById("profileEditOverlay");

const profileEditClose =
document.getElementById("profileEditClose");

const saveProfileButton =
document.getElementById("saveProfileButton");

const editUsername =
document.getElementById("editUsername");

const editBio =
document.getElementById("editBio");

const profileEditMessage =
document.getElementById("profileEditMessage");

/* ==================================================
PROFİL DÜZENLEMEYİ AÇ
================================================== */

if (editProfileButton) {


editProfileButton.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) {

        alert(
            "Profili düzenlemek için önce giriş yapmalısın."
        );

        return;
    }


    try {

        const userDoc =
            await getDoc(
                doc(db, "users", user.uid)
            );


        if (userDoc.exists()) {

            const data =
                userDoc.data();


            if (editUsername) {

                editUsername.value =
                    data.username || "";

            }


            if (editBio) {

                editBio.value =
                    data.bio || "";

            }

        }


        if (profileEditMessage) {

            profileEditMessage.textContent = "";

        }


        if (profileEditOverlay) {

            profileEditOverlay.classList.add("show");

        }

    } catch (error) {

        console.error(
            "Profil düzenleme verisi alınamadı:",
            error
        );

    }

});


}

/* ==================================================
MODAL KAPAT
================================================== */

if (profileEditClose) {


profileEditClose.addEventListener("click", () => {

    if (profileEditOverlay) {

        profileEditOverlay.classList.remove("show");

    }

});


}

if (profileEditOverlay) {


profileEditOverlay.addEventListener(
    "click",
    event => {

        if (event.target === profileEditOverlay) {

            profileEditOverlay.classList.remove(
                "show"
            );

        }

    }
);


}

/* ==================================================
PROFİLİ KAYDET
================================================== */

if (saveProfileButton) {


saveProfileButton.addEventListener(
    "click",
    async () => {

        const user = auth.currentUser;

        if (!user) {

            profileEditMessage.textContent =
                "Oturum bulunamadı.";

            return;
        }


        const newUsername =
            editUsername.value.trim();

        const newBio =
            editBio.value.trim();


        if (!newUsername) {

            profileEditMessage.style.color =
                "#d14b58";

            profileEditMessage.textContent =
                "Kullanıcı adı boş bırakılamaz.";

            return;
        }


        try {

            saveProfileButton.disabled = true;

            saveProfileButton.textContent =
                "Kaydediliyor...";


            await setDoc(
                doc(db, "users", user.uid),
                {
                    username: newUsername,
                    bio: newBio
                },
                {
                    merge: true
                }
            );


            /* PROFİLİ EKRANDA HEMEN GÜNCELLE */

            const profileName =
                document.getElementById(
                    "profileName"
                );

            const profileUsername =
                document.getElementById(
                    "profileUsername"
                );

            const profileBio =
                document.getElementById(
                    "profileBio"
                );

            const profileAvatar =
                document.getElementById(
                    "profileAvatar"
                );


            if (profileName) {

                profileName.textContent =
                    newUsername;

            }


            if (profileUsername) {

                profileUsername.textContent =
                    "@" + newUsername;

            }


            if (profileBio) {

                profileBio.textContent =
                    newBio ||
                    "Henüz bir bio eklenmemiş.";

            }


            if (profileAvatar) {

                profileAvatar.textContent =
                    newUsername
                        .charAt(0)
                        .toUpperCase();

            }


            /* ÜSTTEKİ KULLANICI ADINI DA GÜNCELLE */

            const loggedUser =
                document.querySelector(
                    ".logged-user"
                );


            if (loggedUser) {

                loggedUser.textContent =
                    "@" + newUsername;

            }


            profileEditMessage.style.color =
                "#3c8a67";

            profileEditMessage.textContent =
                "Profil başarıyla güncellendi!";


            setTimeout(() => {

                if (profileEditOverlay) {

                    profileEditOverlay.classList.remove(
                        "show"
                    );

                }

            }, 900);


        } catch (error) {

            console.error(
                "Profil güncelleme hatası:",
                error
            );


            profileEditMessage.style.color =
                "#d14b58";

            profileEditMessage.textContent =
                "Profil güncellenirken hata oluştu.";

        } finally {

            saveProfileButton.disabled =
                false;

            saveProfileButton.textContent =
                "Değişiklikleri Kaydet";

        }

    }
);


}

// ==================================================
// FIREBASE GÖNDERİLERİNİ ANA AKIŞTA GÖSTER
// ==================================================

function loadPosts() {

    const feed = document.querySelector(".feed");

    if (!feed) return;

    const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(
        postsQuery,
        snapshot => {

            // Eski Firebase gönderilerini temizle
            document
                .querySelectorAll(".firebase-post")
                .forEach(post => post.remove());


            snapshot.forEach(docSnapshot => {

                const data =
                    docSnapshot.data();

                const post =
                    document.createElement("article");

                post.className =
                    "post firebase-post";

                post.dataset.postId =
    docSnapshot.id;

                const username =
                    data.username ||
                    "Kullanıcı";


                const text =
                    data.text ||
                    "";


                post.innerHTML = `

                    <div class="post-header">

                        <div class="post-avatar avatar-1">

                            ${username
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div class="post-author">

                            <strong>
                                ${username}
                            </strong>

                            <span>
                                @${username}
                            </span>

                        </div>


                        <button class="post-menu">
                            ···
                        </button>

                    </div>


                    <div class="post-body">

                        <p>
                            ${text}
                        </p>

                    </div>


                    <div class="post-meta">

                        <div>

                            <span class="liked">
                                ♥
                            </span>

                           <span class="like-count">
    0
</span>

                        </div>


                        <span>
                            0 yorum
                        </span>

                    </div>


                    <div class="post-actions">

                        <button class="action like-action">

                            <span>
                                ♡
                            </span>

                            Beğen

                        </button>


                        <button class="action">

                            <span>
                                ◯
                            </span>

                            Yorum

                        </button>


                        <button class="action">

                            <span>
                                ↗
                            </span>

                            Paylaş

                        </button>


                        <button class="action save-action">

                            <span>
                                ⌑
                            </span>

                        </button>

                    </div>

                `;


                feed.appendChild(post);


              // ==================================================
// GERÇEK BEĞENİ BUTONU
// ==================================================

const likeButton =
    post.querySelector(
        ".like-action"
    );

if (likeButton) {

    likeButton.addEventListener(
        "click",
        () => {

            toggleLike(
                likeButton,
                postId
            );

        }
    );

}
            });

        },

        error => {

            console.error(
                "Gönderiler yüklenemedi:",
                error
            );

        }
    );

}


// ==================================================
// GİRİŞ YAPILDIĞINDA GÖNDERİLERİ YÜKLE
// ==================================================

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            loadPosts();

        }

    }
);
