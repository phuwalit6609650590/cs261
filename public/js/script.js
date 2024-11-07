
let isSubmitting = false; 

function submitLogin() {
    
    if (isSubmitting) {
        return;
    }
    
    // ป้องกันการส่งซ้ำ
    isSubmitting = true;

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


   
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TUc5ebf849dbf40bbf6c2e08b39871ce155af8f632f03e869ee720d1e4cee9fd147dba9fd5885339a521d8701701bae419'  // ใช้ Application Key ถ้ามี
        },
        body: JSON.stringify({
            "UserName" : username,
            "PassWord" : password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login failed: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Login response:', data);  // พิมพ์ข้อมูลที่ได้รับจาก API บน console เด้อ

       
        if (data.status === true) {  
           
            return fetchUserData(username); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลผู้ใช้
        } else {
            document.getElementById('loginMessage').innerText = data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
            throw new Error("Login failed: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ไม่สามารถ Login ได้สำเร็จ');
    })
    .finally(() => {
        isSubmitting = false; 
    });
}


// ฟังก์ชันดึงข้อมูลผู้ใช้ (user data API)
function fetchUserData(username) {
    return fetch(`https://restapi.tu.ac.th/api/v2/profile/std/info/?id=${username}`, {  // ใช้ GET สำหรับดึงข้อมูลผู้ใช้
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key': 'TUc5ebf849dbf40bbf6c2e08b39871ce155af8f632f03e869ee720d1e4cee9fd147dba9fd5885339a521d8701701bae419'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch user data: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched user data:', data);  // พิมพ์ข้อมูลที่ได้รับจาก API บน console เด้อ

        // ตรวจสอบว่า status เป็น true และ data มีข้อมูลผู้ใช้
        if (data.status === true && data.data) {
            const userData = data.data;  
            document.getElementById('loginMessage').innerText = `${data.message},${userData.displayname_th},${userData.faculty}`;

            // ส่งข้อมูลไปยัง Spring Boot API
            return sendUserDataToBackend(userData, username);
        } else {
            document.getElementById('loginMessage').innerText = 'ไม่พบข้อมูลผู้ใช้นี้';
            throw new Error("User data not found");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    });
}


// ฟังก์ชันส่งข้อมูลผู้ใช้ไปยัง Spring Boot API
function sendUserDataToBackend(userData, username) {
    return fetch('http://localhost:8080/api/student/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userName": username,
            "type": userData.type,
            "engName": userData.displayname_en,
            "email": userData.email,
            "faculty": userData.faculty
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send data to backend');
        }
        return response.json();  // แปลง response เป็น JSON
    })
    .then(data => {
        console.log('Backend Response:', data);  // ตรวจสอบข้อมูลที่ตอบกลับจาก backend บน console

     
        if (data.userName) {  
            alert('Login successful!');
        } else {
            // แสดงข้อความจาก backend ถ้าไม่สำเร็จ
            document.getElementById('loginMessage').innerText = data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ113';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('ไม่สามารถส่งข้อมูลเข้าสู่ระบบได้');
    });
}




document.getElementById('login-btn').addEventListener('click', submitLogin); 

function checkFormCompletion() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    document.getElementById('login-btn').disabled = !(username && password);  // ปุ่ม login จะไม่ทำงานจนกว่าจะกรอกข้อมูลครบ
}

// การตรวจสอบ username
document.getElementById('username').addEventListener('input', function() {
    const username = this.value;
    const messageDiv = document.getElementById('message-username');

    if (!username) {
        messageDiv.textContent = 'fill your username';
    } else {
        messageDiv.textContent = ''; 
    }
    checkFormCompletion();
});

// การตรวจสอบ password
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const messageDiv = document.getElementById('message-password');

    if (!password) {
        messageDiv.textContent = 'fill your password';
    } else {
        messageDiv.textContent = ''; 
    }
    checkFormCompletion();
});

// แสดง/ซ่อน password
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
