//Usei o express para criar e configurar meu servidor
const express = require("express")
const server = express()

const db = require("./db")

// const idea = [
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius  inventore",
//     url: "https://coursera.com"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
//     title: "Exercicios",
//     category: "Saúde",
//     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius  inventore",
//     url: ""
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
//     title: "Meditação",
//     category: "Mentalidade",
//     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius  inventore",
//     url: ""
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
//     title: "Karaoke",
//     category: "Diversão em Família",
//     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius  inventore",
//     url: ""
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729038.svg",
//     title: "Pintura",
//     category: "Criatividade",
//     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius  inventore",
//     url: ""
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2729/2729048.svg",
//     title: "Recortes",
//     category: "Criatividade",
//     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius  inventore",
//     url: ""
//   }
// ]



//configurar arquivos estáticos(css,img, scripts...)
server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))


//configuração nunjucks
const nunjucks=require("nunjucks")
nunjucks.configure("views", {
  express: server,
  noCache: true,
})

//criei uma rota /
//e capturo o pedido do cliente para responder
server.get("/",function(req, res){

  db.all(`SELECT * FROM ideas`, function(err, rows){
    if (err){ 
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

    const reversedIdeas= [...rows].reverse()

    let lastIdeas=[]
    for (let ideia of reversedIdeas){
      if(lastIdeas.length < 2){
        lastIdeas.push(ideia)
      }
    }
    return res.render("index.html", {idea: lastIdeas})
  })



})

server.get("/ideias",function(req, res){
  db.all(`SELECT * FROM ideas`, function(err, rows){
    if (err){ 
      console.log(err)
      return res.send("Erro no banco de dados!")
    }

  const reversedIdeas= [...rows].reverse()

  return res.render("ideia.html", {idea: reversedIdeas})
  })
})

server.post("/", function(req, res){
  //Inserir dados na tabela
  const query = `
    INSERT INTO ideas(
      image,
      title,
      category,
      description,
      link
    ) VALUES(?,?,?,?,?);
  `
  const values =[
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link

  ]
  db.run(query, values, function(err){
    if (err){ 
      console.log(err)
      return res.send("Erro no banco de dados!")
    }
    return res.redirect("/ideias")
  })
})

//criei um servidor na porta 3000
server.listen(3000)