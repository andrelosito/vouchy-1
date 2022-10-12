function RegisterUser() {
    var name = document.getElementById('registerName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        swal("Success!", "User registered successfully!", "success");
    }).catch((error) => {

        var errorcode = error.code;
        var errormsg = error.message;
        swal("Oops!", errormsg, "warning");

    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.assign("http://localhost:5500/welcome.html")

    } else {

    }
});



function LoginUser() {
    var userEmail = document.getElementById('loginEmail').value;
    var userPass = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
        .then(() => {
            window.location.assign("http://localhost:5500/welcome.html")

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            swal("Oops!", errorMessage, "warning");
        });
}



const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});