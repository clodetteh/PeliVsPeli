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


module.exports = {
    generarCompetencias : generarCompetencias
};