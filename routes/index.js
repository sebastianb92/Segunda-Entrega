var express = require('express');
var router = express.Router();
const { conexion } = require('../database/conexion')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Pagina Centro Medico' });
});



// Enrutamiento para agregar medicos
router.post('/agregar-medico', (req, res) => {
  const nombres = req.body.nombres
  const apellidos = req.body.apellidos
  const cedula = req.body.cedula
  const consultorio = req.body.consultorio
  const telefono = req.body.telefono
  const correo = req.body.correo
  const especialidad = req.body.especialidad
  conexion.query(`insert into medicos (cedula,nombres,apellidos,especialidad,consultorio,correo,telefono) values (${cedula},'${nombres}','${apellidos}','${especialidad}','${consultorio}','${correo}','${telefono}')`, (error, resultado) => {
    if (error) {
      console.log('Error de ejecucuon en la consulta', error)
      res.status(500).send('Error en la ejecucion')
    } else {
      res.status(200).redirect('/listado-medicos')
    }
  })
})

// Enrutamiento para visualizar los medicos

router.get('/listado-medicos', (req, res) => {
  conexion.query('select * from medicos;', (error, resultado) => {
    if (error) {
      console.log('Error de ejecucuon en la consulta', error)
      res.status(500).send('Error en la ejecucion')
    } else {
      res.status(200).render('medicos', { resultado })
    }
  })
})

// Enrutamiento para agregar pacientes
router.post('/agregar-paciente', (req, res) => {
  const nombres = req.body.nombres
  const apellidos = req.body.apellidos
  const cedula = req.body.cedula
  const fecha_nacimiento = req.body.fecha_nacimiento
  const telefono = req.body.telefono
  conexion.query(`insert into pacientes (cedula,nombres,apellidos,fecha_nacimiento,telefono) values (${cedula},'${nombres}','${apellidos}','${fecha_nacimiento}','${telefono}')`, (error, resultado) => {
    if (error) {
      console.log('Error de ejecucuon en la consulta', error)
      res.status(500).send('Error en la ejecucion')
    } else {
      res.status(200).redirect('/listado-pacientes')
    }
  })
})

// Enrutamiento para visualizar los pacientes

router.get('/listado-pacientes', (req, res) => {
  conexion.query('select * from pacientes;', (error, resultado) => {
    if (error) {
      console.log('Error de ejecucuon en la consulta', error)
      res.status(500).send('Error en la ejecucion')
    } else {
      res.status(200).render('pacientes', { resultado })
    }
  })
})

// Enrutamiento para consultar citas medicas
router.post('/consulta-cita', (req, res) => {
  // const cedula = req.body.cedula
  // const fecha_nacimiento = req.body.fecha_nacimiento
  const especialidad = req.body.especialidad
  conexion.query(`select * from medicos where especialidad ='${especialidad}'`, (error, resultado) => {
    if (error) {
      console.log('Error de ejecucuon en la consulta', error)
      res.status(500).send('Error en la ejecucion')
    } else {
      res.status(200).render('agendar-citas', { resultado })
    }
  })
})
// Enrutamiento para agendar citas medicas
router.post('/agregar-cita', (req, res) => {
  const cedula_paciente = req.body.cedula
  const fecha_cita = req.body.fecha_cita
  const cedula_medico = req.body.medico
  conexion.query(`insert into cita_medica (cedula_medico,cedula_paciente,fecha_cita) values (${cedula_medico},${cedula_paciente},'${fecha_cita}')`, (error, resultado) => {
    if (error) {
      console.log('Error de ejecucuon en la consulta', error)
      res.status(500).send('Error en la ejecucion')
    } else {
      res.status(200).redirect('/listado-citas')
    }
  })
})

// Enrutamiento para visualizar las citas agendadas

router.get('/listado-citas', (req, res) => {
  conexion.query('select fecha_cita, concat(p.nombres," ",p.apellidos) as paciente, p.telefono, m.especialidad, m.consultorio, concat(m.nombres," ",m.apellidos) as medico from cita_medica c inner join pacientes p on c.cedula_paciente=p.cedula inner join medicos m on c.cedula_medico = m.cedula; ', (error, resultado) => {
  if (error) {
    console.log('Error de ejecucuon en la consulta', error)
    res.status(500).send('Error en la ejecucion')
  } else {
    res.status(200).render('citas', { resultado })
  }
})
})

module.exports = router;