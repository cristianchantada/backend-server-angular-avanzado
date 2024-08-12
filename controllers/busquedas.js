// getTodo
const { response } = require('express');

const getTodo = (req, res = response) => {

  const busqueda = req.params.busqueda;

  res.json({
    ok: true,
    msg: 'Búsquedas',
    busqueda
  })

}

module.exports = {
  getTodo,
}