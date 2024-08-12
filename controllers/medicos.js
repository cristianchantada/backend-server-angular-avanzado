
const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

  const medicos = await Medico.find()
    .populate('usuario', 'nombre img')
    .populate('hospital', 'nombre img')
  
  res.json({
    ok: true,
    medicos
  });

}

const crearMedico = async (req, res = response) => {

  const uid = req.uid;
  const {nombre, hospital} = req.body;

  console.log({data: {nombre, hospital}});
  

  const medico = new Medico({
    nombre,
    usuario: uid,
    hospital 
  })

  try {
    
    const medicoDB  = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB
    });

  } catch (error) {
    console.log({error});
    
    res.status(500).json({
      ok: false,
      msg: 'Error en la creación del médico'
    });
  }
  


}

const actualizarMedico = (req, res = response) => {
  
  res.json({
    ok: true,
    msg: 'actualizar medico'
  });

}

const borrarMedico = (req, res = response) => {
  
  res.json({
    ok: true,
    msg: 'borrar medico'
  });

}

module.exports = {
  getMedicos,
  actualizarMedico,
  borrarMedico,
  crearMedico
}