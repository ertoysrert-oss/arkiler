document.addEventListener("DOMContentLoaded", () => {

    const likeButtons = document.querySelectorAll(".like-action");

    likeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const icon = button.querySelector("span");

            if (button.classList.contains("liked-post")) {

                button.classList.remove("liked-post");

                icon.textContent = "♡";

            } else {

                button.classList.add("liked-post");

                icon.textContent = "♥";

            }

        });

    });


    const followButtons = document.querySelectorAll(".suggestion button");

    followButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (button.textContent.trim() === "Takip") {

                button.textContent = "Takiptesin";

                button.style.background = "#eeeeff";
                button.style.color = "#5b5ce2";

            } else {

                button.textContent = "Takip";

                button.style.background = "#15171a";
                button.style.color = "white";

            }

        });

    });


    const searchInput = document.querySelector(".global-search input");

    if (searchInput) {

        searchInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                const value = searchInput.value.trim();

                if (value !== "") {

                    alert("Arama sistemi Firebase bağlantısından sonra aktif olacak.");

                }

            }

        });

    }


    const publishButton = document.querySelector(".publish-button");
    const composerInput = document.querySelector(".composer-input");

    publishButton.addEventListener("click", () => {

        alert("Gönderi oluşturma sistemi kullanıcı hesabı ve Firebase bağlantısından sonra aktif olacak.");

    });

    composerInput.addEventListener("click", () => {

        alert("Gönderi oluşturma sistemi yakında aktif olacak.");

    });

});
