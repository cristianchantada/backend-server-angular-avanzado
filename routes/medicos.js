/**
 *  Ruta: api/medico
 */

const { Router } = require('express');
const { check } = require('express-validator')
const {
  getMedicos,
  actualizarMedico,
  borrarMedico,
  crearMedico,
  getMedicoById
} = require('../controllers/medicos')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT , getMedicos);
router.post('/', 
  [
    validarJWT ,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital debe de ser válido').isMongoId(),
    validarCampos,
  ], crearMedico);

router.put('/:id', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital debe de ser válido').isMongoId(),
    validarCampos,
  ], actualizarMedico);

router.delete('/:id',  validarJWT, borrarMedico);
router.get('/:id',  validarJWT, getMedicoById);

module.exports = router;
