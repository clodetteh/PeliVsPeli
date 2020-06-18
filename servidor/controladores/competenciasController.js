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
    
}


module.exports = {
    generarCompetencias : generarCompetencias,
    generarDosOpciones : generarDosOpciones
};