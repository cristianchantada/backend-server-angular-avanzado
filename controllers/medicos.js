
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

const getMedicoById = async (req, res = response) => {

  const id = req.params.id
  
  console.log(id);
  

  try {

    const medico = await Medico.findById(id)
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img')
      
    console.log({medico});
    

    if(!medico){
      return res.status(404).json({
        ok: false,
        msg: 'Médico no encontrado'
      })
    }
  
    
    res.json({
      ok: true,
      medico
    });
    
  } catch (error) {
    console.log({error});
    
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar el médico'
    });
  }


}

const crearMedico = async (req, res = response) => {

  const uid = req.uid;
  const {nombre, hospital} = req.body;
  

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

const actualizarMedico = async (req, res = response) => {

  const uid = req.uid;
  const { hospital, nombre } = req.body;
  const id = req.params.id;

  try {

    const medico = await Medico.findById(id);

    if(!medico){
      return res.status(404).json({
        ok: false,
        msg: 'Médico no encontrado'
      })
    }

    medico.nombre = nombre;
    medico.hospital = hospital;
    medico.usuario = uid;

    const newMedico = await Medico
        .findByIdAndUpdate(id, medico, {new: true});

    res.json({
      ok: true,
      medico: newMedico,
    })

  } catch(error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, hable con el administrador',
    })

  }

}

const borrarMedico = async (req, res = response) => {
  
  const id = req.params.id;

  try {

    const medico = Medico.findById(id);

    if(!medico){
      return res.status(404).json({
        ok: false,
        msg: 'Médico no encontrado'
      })
    }

    await Medico
        .findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: 'Médico borrado correctamente',
    })

  } catch(error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, hable con el administrador',
    })

  }

}

module.exports = {
  getMedicos,
  actualizarMedico,
  borrarMedico,
  crearMedico,
  getMedicoById
}