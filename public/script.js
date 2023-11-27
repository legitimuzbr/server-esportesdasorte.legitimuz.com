const legitimuz = Legitimuz({
  host: "https://api.legitimuz.com",
  token: "c2bf534c-4bfd-4a0f-a22a-a9a8e560ae60"
});

legitimuz.mount();

const nameInput = document.getElementById('legitimuz-hydrate-name');

  function checkForValue() {

    if (nameInput.value) {

      const cpf = document.getElementById("legitimuz-hydrate-cpf").value

      fetch('https://sdk-api.legitimuz.com.br/user', {
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
            console.log('Não autorizado');
            document.querySelector("#aviso").classList.remove("d-none");
            document.querySelector("#contador").innerText = `Tente novamente em: ${data.timeLeft}`;
          } else {
            console.log('Autorizado');
            
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