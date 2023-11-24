const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://esportesdasorte.legitimuz.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://mateus:mZ4RBNdxAkLzO9I4@legitimuz.hpaophu.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexão com MongoDB estabelecida com sucesso'))
  .catch(err => console.error('Não foi possível conectar ao MongoDB:', err));


app.set('view engine', 'ejs');

app.use(express.static('public'));

const userSchema = new mongoose.Schema({
  cpf: String,
  lastAction: Date
});


const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/user', async (req, res) => {
  const { cpf } = req.body; // Assume que o CPF é enviado no corpo da requisição

  try {
    // Verifique se o usuário já existe
    const user = await User.findOne({ cpf });

    if (user) {
      
      const now = new Date();
      const lastAction = user.lastAction ? new Date(user.lastAction) : new Date(0);
      const minutesSinceLastAction = (now - lastAction) / (1000 * 60);

      if (minutesSinceLastAction < 1) {
        const remainingTimeMs = (1 * 60 * 1000) - (now - lastAction);
        const remainingMinutes = Math.floor(remainingTimeMs / (1000 * 60));
        const remainingSeconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

        const timeLeftFormatted = `${remainingMinutes}m ${remainingSeconds}s`;
        
        return res.status(200).json({ canVerify: false, message: 'Ação bloqueada', timeLeft: timeLeftFormatted });
      } else {
        user.lastAction = now;
        await user.save();
        buttonElement = `<button class="btn btn-light w-100 btn-lg" id="legitimuz-action-verify">Iniciar verificação</button>`
        return res.status(200).json({ canVerify: true, buttonElement: buttonElement, user });
      }
    
    }

    const newUser = new User({ cpf, lastAction: new Date() });
    await newUser.save();

    res.status(201).json({ canVerify: true, user: newUser });

  } catch (error) {

    res.status(500).send(error.message);

  }
});




app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});