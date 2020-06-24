var con = require('../lib/conexion');

function generarCompetencias(req, res) {
    var id = req.query.id;
    if(id == undefined){
        var sql = 'select * from competencias';
    };

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        };

        var response = resultado;

        res.send(JSON.stringify(response));
    });
};

function generarDosOpciones(req, res) {
    var id = req.params.id;
    var sqlCompetencia = `select * from competencias where id = ${id}`;

    con.query(sqlCompetencia, function(error, resultadoCompetencia){

        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        };

        // select * from pelicula join director on pelicula.director = director.nombre join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id where pelicula.genero_id = 8 and director.id = 3338  and actor_pelicula.actor_id = 566;
        var whereables = {
            id_genero: {column: 'id_genero', filtro:`pelicula.genero_id`, valor: resultadoCompetencia[0].id_genero},
            id_director: { column: 'id_director', filtro: `director.id`, valor: resultadoCompetencia[0].id_director},
            id_actor: { column: 'id_actor', filtro: `actor_pelicula.actor_id`, valor: resultadoCompetencia[0].id_actor}
        }

        var joineables = {
            id_director:  { column: 'id_director', referencia: `join director on pelicula.director = director.nombre`},
            id_actor: { column: 'id_actor', referencia: `join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id`}
        }

        var statement = ``;
        var conditionCount = 0;

        for (const [key, value] of Object.entries(joineables)) {
            statement += ` ${value.referencia}`
        }

        for (const [key, value] of Object.entries(whereables)) {
            if(value.valor != null) {
                if(conditionCount == 0) {
                    statement += ` where`;
                } else {
                    statement += ` and`;
                }
                statement += ` ${value.filtro} = ${value.valor}`
            }
            conditionCount++
        }

        var sqlPeliculas = `select * from pelicula ${statement} order by rand() limit 2`
        


        console.log(sqlPeliculas);
        con.query(sqlPeliculas, function(error, resultadoPelicula){
            if(error){
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            };


            if(resultadoCompetencia.length > 0){
                var response = {
                    'competencia' : resultadoCompetencia[0].nombre,
                    'peliculas' : resultadoPelicula 
                };

                res.send(JSON.stringify(response));
            }else{
                return res.status(404).json("La competencia no existe");
            }
        })
    })
    
};

function votar(req, res){
    var idCompetencia = req.params.id;
    var idPelicula = req.body.idPelicula;
    var sql = `INSERT INTO votos (id_pelicula, id_competencia) VALUES (${idPelicula}, ${idCompetencia})`;

    if(idCompetencia.length > 0 && idPelicula > 0){
        var sql = `INSERT INTO votos (id_pelicula, id_competencia) VALUES (${idPelicula}, ${idCompetencia})`;
    }else{
        return res.status(404).json("No se pudo crear el voto")
    };

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Error al crear el voto", error.message);
            return res.status(404).send("Error al crear el voto");
        }

        res.send(resultado);
    })

};

function borrarVotos(req, res){
    var idCompetencia = req.params.id;
    var sql = `delete from votos where id_competencia = ${idCompetencia}`;

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Error al reiniciar la competencia", error.message);
            return res.status(404).send("Error al reiniciar la competencia");
        }
        
        res.send(resultado);        
    })
}

function verResultado(req,res){
    var idCompetencia = req.params.id;
    var sqlCompetencia = `select nombre from competencias where id = ${idCompetencia}`;
    var sqlPeliculas = `select id_competencia, id_pelicula, count(*)as votos, titulo, poster from votos join pelicula on id_pelicula = pelicula.id group by id_competencia, id_pelicula having id_competencia = ${idCompetencia} order by votos desc limit 0,3`;

    con.query(sqlCompetencia, function(error, resultadoCompetencia){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        con.query(sqlPeliculas, function(error, resultadoPeliculas){
            if(resultadoCompetencia.length > 0){
                var response = {
                    'competencia' : resultadoCompetencia[0].nombre,
                    'resultados' : resultadoPeliculas
                }

                res.send(JSON.stringify(response))

            }else{
                return res.status(404).json("La competencia no existe");
            }
        })       
    })
};

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

        if(existe == true) {
            res.status(422).json("La competencia ya existe"); 
        } else {
            if(nombreCompetencia.length > 0 ){
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
    });
};

function infoCompetencia(req, res){
    var idCompetencia = req.params.id;
    var sql = `select competencias.nombre, genero.nombre as genero_nombre, actor.nombre as actor_nombre, director.nombre as director_nombre from competencias join genero on competencias.id_genero = genero.id join actor on competencias.id_actor = actor.id join director on competencias.id_director = director.id where competencias.id = '${idCompetencia}'`;

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Error al crear el voto", error.message);
            return res.status(404).send("Error al crear el voto");
        }

        var response =  resultado[0];

        res.send(response);
    })
}

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

function eliminarCompetencia(req, res){
    var id = req.params.id;
    var sqlBorrarVotos = `delete from votos where id_competencia = ${id}`
    var sqlBorrarCompentencia = `delete from competencias where id = ${id}` 

    con.query(sqlBorrarVotos, function(error, resultadoVotos){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        con.query(sqlBorrarCompentencia, function(error, resultadoCompetencia){
            if(error){
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }

            res.send(resultadoCompetencia);
        })
    })
};

function editarCompetencia(req, res){
    var idCompetencia = req.params.id;
    var nuevoNombre = req.body.nombre;
    var sql = `update competencias set nombre = '${nuevoNombre}' where id = ${idCompetencia}`;

    con.query(sql, function(error, resultado){
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(resultado);
    })
}



module.exports = {
    generarCompetencias : generarCompetencias,
    generarDosOpciones : generarDosOpciones,
    votar: votar,
    verResultado: verResultado,
    crearCompetencia : crearCompetencia,
    borrarVotos : borrarVotos,
    infoCompetencia : infoCompetencia,
    cargarGeneros : cargarGeneros,
    cargarDirectores : cargarDirectores,
    cargarActores : cargarActores,
    eliminarCompetencia : eliminarCompetencia,
    editarCompetencia : editarCompetencia
};