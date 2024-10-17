const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        document.getElementById('login-btn').disabled = !(username && password && role);
    });
});

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');
togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.innerText = 'Hide';
    } else {
        passwordInput.type = 'password';
        togglePassword.innerText = 'Show';
    }
});


function submitLogin() {
    
    const username = document.getElementById("username").value; 
    const password = document.getElementById("password").value; 

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TUc5ebf849dbf40bbf6c2e08b39871ce155af8f632f03e869ee720d1e4cee9fd147dba9fd5885339a521d8701701bae419'
        },
        body: JSON.stringify({ UserName: username, PassWord: password })
    })

    .then(response => response.json())
    .then(data => {
        
        if(data.status){
                
        console.log(data.message)
                

        }
        else{
                
            console.log(data.message)
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
