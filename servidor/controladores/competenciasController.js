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
    var sqlCompetencia = `select nombre from competencias where id = ${id}`;
    var sqlPeliculas = 'select id, titulo, poster from pelicula order by rand() limit 2';

    con.query(sqlCompetencia, function(error, resultadoCompetencia){

        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        };

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

module.exports = {
    generarCompetencias : generarCompetencias,
    generarDosOpciones : generarDosOpciones,
    votar: votar,
    verResultado: verResultado
};