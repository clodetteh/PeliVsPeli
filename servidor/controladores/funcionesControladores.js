var con = require('../lib/conexion');

function generarQuery (genero, director, actor){
var whereables = {
    id_genero: {column: 'id_genero', filtro:`pelicula.genero_id`, valor: genero},
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

return  `select * from pelicula ${statement} order by rand() limit 2`

}

module.exports = {
    generarQuery : generarQuery
}