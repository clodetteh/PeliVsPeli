var con = require('../lib/conexion');

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

module.exports = {
    eliminarCompetencia : eliminarCompetencia
};

