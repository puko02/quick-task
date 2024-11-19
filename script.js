// Toggle Theme
const themeToggle = document.getElementById('theme');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
});

// Login Button Event Listener
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('email').value;

  if (!email) {
    alert('Please enter your email');
    return;
  }

  await fetch('http://localhost:3001/emails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const check_email = data.some((item) => item.email === email)
        if(check_email){
          alert(`this account ${email} exist`);
        }else{
          alert(`this account ${email} not exist`);
        }
      }).catch((err) => {
        console.error(err)
      })
});
