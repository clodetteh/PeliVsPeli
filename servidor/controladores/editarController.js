var con = require('../lib/conexion');

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

function infoCompetencia(req, res){
    var idCompetencia = req.params.id;
    var sql = `select * from competencias where id = ${idCompetencia}`;

    //select competencias.nombre as nombre, genero.nombre as genero, actor.nombre as actor, director.nombre as director from competencias join genero on id_genero = genero.id join actor on id_actor = actor.id join director on id_director = director.id where competencias.id = 44;

    con.query(sql, function(error, resultadoCompetencia){
        if(error){
            console.log("Error al obtener la información", error.message);
            return res.status(404).send("Error al obtener la información");
        }

        var infoCompetencia = resultadoCompetencia[0];
        var statement = ``;
        var referencia = ``;
        
        if(infoCompetencia.id_genero != null){
            statement += `, genero.nombre as genero`;
            referencia += `join genero on id_genero = genero.id `;
        }
        
        if(infoCompetencia.id_director != null){
            statement += `, director.nombre as director`;
            referencia += `join director on id_director = director.id `;
        }
        
        if(infoCompetencia.id_actor != null){
            statement += `, actor.nombre as actor`;
            referencia += `join actor on id_actor = actor.id `;
        }

        var sqlinfo = `select competencias.nombre as nombre ${statement} from competencias ${referencia} where competencias.id = ${idCompetencia}`; 
        
        con.query(sqlinfo, function(error, resultadoFinal){
            if(error){
                console.log("Error al obtener la información", error.message);
                return res.status(404).send("Error al obtener la información");
            }
            
            var response = resultadoFinal[0];
            res.send(JSON.stringify(response));

        })
        
    })
}

module.exports = {
    borrarVotos : borrarVotos,
    editarCompetencia : editarCompetencia,
    infoCompetencia : infoCompetencia
};