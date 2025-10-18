const { response, request } = require("express");

const obtnerUsuario = (req = request, res = response) => {
  //La ruta es un endpoint (punto de entrada a pantallas)
  //Aqui va la respuesta que quiero dar

  const { nombre = "No name", edad } = req.body; //req es la solicitud que hace el usuario, query son los parametros que vienen en la url
  res.json({
    //res.status(403).json(): status es el codigo de respuesta http para saber si fue ok o hubo un error, hay varios codigos
    Nombre,
    edad,
  });
};

const crearUsuario = (req = request, res = response) => {
  const { nombre, correo, password } = req.body;
  res.json({
    nombre,
    correo,
    password,
  });
};

const actualizarUsuario = (req, res = response) => {
  res.json({
    msg: "actualizar usuario - controlador",
  });
};

module.exports = {
  obtnerUsuario,
  crearUsuario,
  actualizarUsuario,
};
