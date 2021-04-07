function showSignUp() {
    document.querySelector(".sign-in-btn").classList.remove("sign-btn-checked");
    document.querySelector(".sign-up-btn").classList.add("sign-btn-checked");
    //Style the right btn correctly
    document.querySelector(".sign-in").classList.remove("sign-active");
    document.querySelector(".sign-up").classList.add("sign-active");
    //Display the right content with it
}
function showSignIn() {
    document.querySelector(".sign-up-btn").classList.remove("sign-btn-checked");
    document.querySelector(".sign-in-btn").classList.add("sign-btn-checked");
    //Style the right btn correctly
    document.querySelector(".sign-up").classList.remove("sign-active");
    document.querySelector(".sign-in").classList.add("sign-active");
    //Display the right content with it
}
export {showSignUp};
export {showSignIn};
