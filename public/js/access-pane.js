$("#register-container").fadeOut(500);

const loginForm = document.getElementById("login-container");
const registerForm = document.getElementById("register-form");

const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");

const toggleForm = flag => {
    if (flag) {
        $("#login-container").fadeToggle(500);
        $("#register-container").fadeToggle(1000);
    } else {
        $("#register-container").fadeToggle(500);
        $("#login-container").fadeToggle(1000);
    }
};

// TODO: Set custom form submit actions

// loginForm.addEventListener("submit", e => {
//     e.preventDefault();
//     loginButton.disabled = true;
//     loginButton.style.backgroundColor = "#ccc";

//     const url = "http://example.com";
//     fetch(url, {
//         method: "POST",
//         body: JSON.stringify({
//             email: document.getElementById("login-email").value,
//             password: document.getElementById("login-password").value
//         })
//     }).then( (response) => {
// 		if(response.error) {

// 		} else {

// 		}
// 	});
// });

// registerForm.addEventListener("submit", e => {
//     e.preventDefault();
//     registerButton.disabled = true;
// 	registerButton.style.backgroundColor = "#ccc";
	
// 	const url = "http://example.com";
//     fetch(url, {
//         method: "POST",
//         body: JSON.stringify({
//             email: document.getElementById("register-email").value,
//             password: document.getElementById("register-password").value
//         })
//     }).then( (response) => {
// 		if(response.error) {

// 		} else {
			
// 		}
// 	});
// });
