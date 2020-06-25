var con = require('../lib/conexion');

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

        // aca va lo de buscar las competencias

        var whereables = {
            id_genero: {column: 'id_genero', filtro:`pelicula.genero_id`, valor: generoCompetencia},
            id_director: { column: 'id_director', filtro: `director.id`, valor: director},
            id_actor: { column: 'id_actor', filtro: `actor_pelicula.actor_id`, valor: actor}
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
                conditionCount++
            }
            
        }

        var sqlPeliculas = `select * from pelicula ${statement} order by rand() limit 2`
        
        con.query(sqlPeliculas, function(error, resultadosPeliculas){
            if(error){
                console.log("Error al crear el voto", error.message);
                return res.status(404).send("Error al crear el voto");
            }

            if(existe == true) {
                res.status(422).json("La competencia ya existe"); 
            } else if(resultadosPeliculas.length < 2 || resultadosPeliculas[0].pelicula_id == resultadosPeliculas[0].pelicula_id){
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

