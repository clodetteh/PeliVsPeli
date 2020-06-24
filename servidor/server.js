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
app.post('/competencias', controlador.crearCompetencia);
app.get('/competencias/:id/peliculas', controlador.generarDosOpciones);
app.post('/competencias/:id/voto', controlador.votar);
app.delete('/competencias/:id/votos', controlador.borrarVotos);
app.get('/competencias/:id', controlador.infoCompetencia);
app.get('/competencias/:id/resultados', controlador.verResultado);
app.get('/generos', controlador.cargarGeneros);
app.get('/directores', controlador.cargarDirectores);
app.get('/actores', controlador. cargarActores);
app.delete('/competencias/:id', controlador.eliminarCompetencia);
app.put('/competencias/:id', controlador.editarCompetencia);



//Base de datos
var puerto = '8080';

app.listen(puerto, function () {
    console.log( "Escuchando en el puerto " + puerto );
  });