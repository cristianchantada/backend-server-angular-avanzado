const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {

  const desde = Number(req.query.desde) || 0;

  // const usuarios = await Usuario
  //   .find({}, 'nombre email role google')
  //   .skip(desde).limit(5);

  // const total = await Usuario.countDocuments();

  const [usuarios, total ] = await Promise.all([

     Usuario.find({}, 'nombre email role google img')
      .skip(desde).limit(5),

    Usuario.countDocuments()
  ])

  res.json({
    ok: true,
    usuarios,
    total
  })
}

const crearUsuario = async (req, res) => {

  const { email, password } = req.body;

  try {

    const existeEmail = await Usuario.findOne({email});

    if(existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado',
      });
    }
    
    const usuario = new Usuario(req.body);

    // Encriptar contraseña

    const salt = bcrypt.genSaltSync();
    usuario.password = await bcrypt.hash(password, salt);

    // guardar usuario
    await usuario.save();
    const token = await generarJWT(usuario.id)
    

    res.json({
      ok: true,
      usuario, 
      token
    })
    
  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs'
    })
    
  }

}

const actualizarUsuario = async (req, res = response) => {
  
  const uid = req.params.id;

  try {

    const usuarioDB = await Usuario.findById(uid);

    if(!usuarioDB){
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id'
      })
    }

    // Actualizaciones
    const {password, google, email, ...campos} = req.body;

    if( usuarioDB.email !== email){
      const existeEmail = await Usuario.findOne({email})
      
      if(existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email'
        })
      }
    
    }

    if(!usuarioDB.google){
      campos.email = email;
    } else if ( usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: 'Usuario de google no puede cambiar su email',
      })
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado al acutalizar el usuario'
    })
  
  }

}


const borrarUsuario = async (req, res = response) => {

  const uid = req.params.id;

  try {

    const usuarioDB = await Usuario.findById(uid);

    if(!usuarioDB){
      return res.json({
        ok: false,
        msg: 'uid no válido',
      })
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'Usuario eliminado'
    });
    
  } catch (error) {

    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error inesperado al eliminar el usuario'
    })
  }

}

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario
};