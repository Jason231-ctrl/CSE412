/*window.$ = window.jQuery = require('jquery');*/
document.getElementById("continueImg").addEventListener("click", continueLogin);
function continueLogin()
{
    /*window.open("https://www.google.com", "_self")*/
    document.getElementById("logoTransition").classList.add("logoImgActive");
    document.getElementById("continueImg").style.visibility = "hidden";
    document.getElementById("loginBack").classList.add("loginBackground");
    document.getElementById("profile").classList.add("profileEdits");
    document.getElementById("profilePicture").classList.add("profImg");
    document.getElementById("username").classList.add("loginInput");
    document.getElementById("playerTransition").classList.add("playerTransitionAnimation");
    document.getElementById("login").classList.add("loginButton");
    document.getElementById("userCreationButton").classList.add("userCreationButtonAnimation");
    /*document.getElementById("loginBack").style.visibility = "visible";
    setTimeout(function(){ 
        alert("hi");
        }, 5000) */
}

document.getElementById("login").addEventListener("click", nextScreen);
function nextScreen()
{
    /*window.open("../boardScreen/index.html", "_self")*/
}

document.getElementById("login").addEventListener("click", nextScreen);
function nextScreen()
{
    var authenticationCheck = false;
    if(authenticationCheck = true){
        document.getElementById("top").classList.add("topIntroAnimation");
        document.getElementById("middle").classList.add("middleIntroAnimation");
        document.getElementById("bottom").classList.add("bottomIntroAnimation");
        setTimeout(() => {
            window.open("../dashboardScreen/dashboard.html", "_self");
        },1200);
    }
}

document.getElementById("userCreationButton").addEventListener("click", userCreation);
function userCreation()
{
    document.getElementById("loginBack").classList.add("userCreationBackground");
    document.getElementById("profile").style.visibility = "hidden";
    document.getElementById("userCreationButton").style.visibility = "hidden";
    document.getElementById("login").style.visibility = "hidden";
    document.getElementById("accountCreation").classList.add("accountCreationButton");
    document.getElementById("newUsername").classList.add("accountCreationInputsText");
    document.getElementById("newPassword").classList.add("accountCreationInputsText");
    document.getElementById("newEmail").classList.add("accountCreationInputsText");
    document.getElementById("accountCreationInputs").classList.add("accountCreationInputsAnimation");
}

document.getElementById("accountCreation").addEventListener("click", newAccount);
function newAccount()
{
    /*document.getElementById("newUsername").value;*/
}