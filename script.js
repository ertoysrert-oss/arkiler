const postInput = document.querySelector(".create-content input");
const postButton = document.querySelector(".post-button");

postButton.addEventListener("click", function () {

    const text = postInput.value.trim();

    if (text === "") {
        postInput.focus();
        return;
    }

    alert("Gönderi sistemi Firebase bağlantısından sonra aktif olacak.");

    postInput.value = "";
});
