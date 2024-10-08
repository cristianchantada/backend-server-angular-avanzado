/**
 *  Ruta: api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator')
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdmiRole, validarAdmiRoleOMismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT ,getUsuarios);
router.post('/', 
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
  ], crearUsuario);

router.put('/:id', 
  [
    validarJWT,
    validarAdmiRoleOMismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    //check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
  ], actualizarUsuario);

router.delete('/:id', [validarJWT, validarAdmiRole], borrarUsuario)

module.exports = router;
