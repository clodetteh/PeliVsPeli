var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


//Referencia controladores
var controlador = require('./controladores/competenciasController');

//Llamado dependencias
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//rutas
app.get('/competencias', controlador.generarCompetencias);
app.get('/competencias/:id/peliculas', controlador.generarDosOpciones);
app.post('/competencias/:id/voto', controlador.votar);
app.get('/competencias/:id/resultados', controlador.verResultado);


//Base de datos
var puerto = '8080';

app.listen(puerto, function () {
    console.log( "Escuchando en el puerto " + puerto );
  });