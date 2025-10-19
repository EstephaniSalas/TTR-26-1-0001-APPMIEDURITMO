const { response, request } = require("express");

const crearFlascard = (req = request, res = response) => {
    res.json({
    msg: "crear flashcard - controlador",
  });
};

const obtenerFlashcard = (req = request, res = response) => {
    res.json({
    msg: "obtener flashcard - controlador",
  });
};

const modificarFlascard = (req = request, res = response) => {
    res.json({
    msg: "modificar flashcard - controlador",
  });
};

const borrarFlashcard = (req = request, res = response) => {
    res.json({
    msg: "borrar flashcard - controlador",
  });
};


module.exports = {
    crearFlascard,
    obtenerFlashcard,
    modificarFlascard,
    borrarFlashcard,
};