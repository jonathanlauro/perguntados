const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('../databases/database');
const Pergunta = require('../databases/perguntas')
const Resposta = require('../databases/Resposta');
//Config
  //Banco de dados 
  connection.authenticate().then(()=>{
    console.log('Conexão efetuada ao Banco de dados mysql');
  }).catch((err)=>{
    console.log(`Erro ao se conectar ao Banco de Dados. Erro --> ${err}`); 
  });
  //view
  app.set('view engine','ejs');
  app.use(express.static('public'));

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
//Routes
  app.get("/",(req,res)=>{ 
    Pergunta.findAll({raw:true,order:[
      ['id','DESC']
    ]}).then(perguntas => {
      res.render('index',{
        perguntas:perguntas
      });  
    })
    
  });
  app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
  });
  app.post("/perguntasalva",(req,res)=>{
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    Pergunta.create({
      titulo:titulo,
      descricao:descricao
    }).then(()=>{
      res.redirect('/');
    }).catch((err)=>{
      console.log(`Erro ao criar pergunta. erro --> ${err}`);
    })
  });
  app.get('/pergunta/:id',(req,res)=>{
    let id = req.params.id;
    Pergunta.findOne({
      where:{id: id} 
    }).then(pergunta =>{
      if(pergunta != undefined){

        Resposta.findAll({
          where: {perguntaId:pergunta.id},
          order:[['id','DESC']]
        }).then(resposta =>{
          res.render('pergunta',{pergunta:pergunta,resposta:resposta});
        })
      }else{
        res.redirect('/');
      }
    })
  })
  app.post('/responder',(req,res)=>{
    Resposta.create({
      corpo:req.body.corpo,
      perguntaId:req.body.perguntaid
    }).then(()=>{
      res.redirect(`/pergunta/${req.body.perguntaid}`);
      console.log(`voce respondeu a pergunta ${req.body.perguntaid}`)
    }).catch((err)=>{
      console.log(`Erro ao responder. Erro --> ${err}`);
    })
  })

//Others
  const porta = process.env.PORT ||8081;
  app.listen(porta,()=>{
    console.log(`Servidor rodando na porta: http://localhost:${porta}`);
  });