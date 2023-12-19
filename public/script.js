document.getElementById('legitimuz-hydrate-cpf').addEventListener('input', function(e) {
  var value = e.target.value.replace(/\D/g, '');
  if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  e.target.value = value;
});

const legitimuz = Legitimuz({
  host: "https://api.legitimuz.com",
  token: "bbb27c98-21fe-45d9-8f6a-a581d6504fd0"
});

legitimuz.mount();

const nameInput = document.getElementById('legitimuz-hydrate-name');

  function checkForValue() {

    if (nameInput.value) {

      const cpf = document.getElementById("legitimuz-hydrate-cpf").value

      fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.error('Erro na resposta da requisição');
          }
        })
        .then((data) => {
          if (!data.canVerify) {
            console.log(data)
            console.log('Não autorizado');
            document.querySelector("#aviso").classList.remove("d-none");
            document.querySelector("#contador").innerText = `Tente novamente em: ${data.timeLeft}`;
          } else {
            console.log('Autorizado');
            console.log(data)
            document.getElementById("botao").innerHTML = data.buttonElement;
            legitimuz.mount()

            document.getElementById("legitimuz-hydrate-cpf").disabled = true;
          }
        })
        .catch((error) => {
          console.error('Erro na requisição', error);
        });

    } else {
      
      setTimeout(checkForValue, 1000);

    }
  }

  checkForValue();


  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'legitimuz-action-verify') {
      const cpf = document.getElementById("legitimuz-hydrate-cpf").value;
  
      fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf }),
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Erro na resposta da requisição');
        }
      })
      .then((data) => {
        document.querySelector("#aviso").classList.remove("d-none");
        document.querySelector("#contador").innerText = `Tente novamente em: ${data.timeLeft}`;
        document.querySelector("#legitimuz-action-verify").classList.add("d-none")
      })
      .catch((error) => {
        console.error('Erro na requisição', error);
      });
    }
  });
  


function legitimuzLinkOn() {
  $("#brand").css({
    textDecoration: 'underline',
    cursor: 'pointer'
  });
}

function legitimuzLinkOut() {
  $("#brand").css('textDecoration', 'none');
}

function legitimuzLink() {
  window.open("https://legitimuz.com/", "_blank");
}