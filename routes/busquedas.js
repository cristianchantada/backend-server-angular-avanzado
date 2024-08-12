/**
 * Ruta: api/todo/:busqueda
 */


const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  getTodo,
} = require('../controllers/busquedas')

const router = Router();

router.get('/:busqueda', validarJWT, getTodo);

module.exports = router;