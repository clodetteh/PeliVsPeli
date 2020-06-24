var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


//Referencia controladores
var controlador = require('./controladores/competenciasController');
var crearControlador = require('./controladores/crearController');
var editarControlador = require('./controladores/editarController');
var eliminarControlador = require('./controladores/eliminarController');

//Llamado dependencias
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//rutas
app.get('/competencias', controlador.generarCompetencias);
app.post('/competencias', crearControlador.crearCompetencia);
app.post('/competencias/:id/voto', controlador.votar);
app.get('/competencias/:id/peliculas', controlador.generarDosOpciones);
app.delete('/competencias/:id/votos', editarControlador.borrarVotos);
app.get('/competencias/:id', editarControlador.infoCompetencia);
app.get('/competencias/:id/resultados', controlador.verResultado);
app.get('/generos', crearControlador.cargarGeneros);
app.get('/directores', crearControlador.cargarDirectores);
app.get('/actores', crearControlador. cargarActores);
app.delete('/competencias/:id', eliminarControlador.eliminarCompetencia);
app.put('/competencias/:id', editarControlador.editarCompetencia);



//Base de datos
var puerto = '8080';

app.listen(puerto, function () {
    console.log( "Escuchando en el puerto " + puerto );
  });