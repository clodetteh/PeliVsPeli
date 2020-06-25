var con = require('../lib/conexion');
var Query = require('./funcionesControladores');

function crearCompetencia(req, res){            
    var nombreCompetencia = req.body.nombre;
    var generoCompetencia = req.body.genero;
    var actor = req.body.actor;
    var director = req.body.director;
    var sqlCompetencias = `select nombre from competencias where nombre = '${nombreCompetencia}'`;
    var existe = false;

    (generoCompetencia != 0) ? generoCompetencia = generoCompetencia : generoCompetencia = null;
    (actor != 0) ? actor = actor : actor = null;
    (director != 0) ? director = director : director = null;

    con.query(sqlCompetencias, function(error, competenciasActuales){
        if(error){
            console.log("Error al crear el voto", error.message);
            return res.status(404).send("Error al crear el voto");
        }

        competenciasActuales.forEach(element => {
            if(nombreCompetencia === element.nombre){
                existe = true
            }
        });

        // Funcion en funcionesControladores

        var sqlPeliculas = Query.generarQuery(generoCompetencia, director, actor);
        
        con.query(sqlPeliculas, function(error, resultadosPeliculas){
            if(error){
                console.log("Error al crear el voto", error.message);
                return res.status(404).send("Error al crear el voto");
            }

            if(existe == true) {
                res.status(422).json("La competencia ya existe"); 
            } else if(resultadosPeliculas.length < 2){
                res.status(422).json("No hay peliculas para comparar");
            }else{
                if(nombreCompetencia.length > 0){
                    var sqlnuevaCompetencia = `INSERT INTO competencias (nombre, id_genero, id_director, id_actor) VALUES ('${nombreCompetencia}', ${generoCompetencia}, ${director}, ${actor})`;
                    
                    con.query(sqlnuevaCompetencia, function(error, resultado){
                        
                        if(error){
                            console.log("Error al crear la competencia", error.message);
                            res.status(404).send("Error al crear la competencia");
                        } else {
                            res.send(resultado);
                        }  
                    })
                }else{
                    res.status(422).json("El nombre es obligatorio");
                }
            }
        })
    });
};

function cargarGeneros(req, res){
    var genero = req.query.genero;
    
    if(!genero){
        var sql = "select * from genero";
    };

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(resultado);
    });
}

function cargarDirectores(req, res){
    var directores = req.query.directores;

    if(!directores){
         var sql = 'select * from director';
    }

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(resultado);
    })
};

function cargarActores(req, res){
    var actores = req.query.actores;

    if(!actores){
        var sql = 'select * from actor';
    }

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(resultado);
    });
}


module.exports = {
    crearCompetencia : crearCompetencia,
    cargarGeneros : cargarGeneros,
    cargarDirectores : cargarDirectores,
    cargarActores : cargarActores
};

