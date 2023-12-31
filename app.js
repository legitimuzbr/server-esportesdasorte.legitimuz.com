require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors'); 

app.use(cors({
  origin: 'https://esportesdasorte.legitimuz.com',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

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
  const { cpf } = req.body;

  try {

    const user = await User.findOne({ cpf });

    buttonElement = `<button class="btn btn-light w-100 btn-lg" id="legitimuz-action-verify">Iniciar verificação</button>`

    if (user) {
      
      const now = new Date();
      const lastAction = user.lastAction ? new Date(user.lastAction) : new Date(0);
      const hoursSinceLastAction = (now - lastAction) / (1000 * 60 * 60);
    
      if (hoursSinceLastAction < 24) {
        const remainingTimeMs = (24 * 60 * 60 * 1000) - (now - lastAction); 
        const remainingHours = Math.floor(remainingTimeMs / (1000 * 60 * 60)); 
        const remainingMinutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)); 
        const timeLeftFormatted = `${remainingHours}h ${remainingMinutes}m`;
            
        return res.status(200).json({ canVerify: false, message: 'Ação bloqueada', timeLeft: timeLeftFormatted });
      } else {
        user.lastAction = now;
        await user.save();
        return res.status(200).json({ canVerify: true, buttonElement: buttonElement, user });
      }
    }

    const newUser = new User({ cpf, lastAction: new Date() });
    await newUser.save();

    res.status(201).json({ canVerify: true, buttonElement: buttonElement, user: newUser });

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