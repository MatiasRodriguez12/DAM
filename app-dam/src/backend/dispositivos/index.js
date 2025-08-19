const express = require('express')

const routerDispositivos = express.Router()

var pool = require('../mysql-connector')

routerDispositivos.get('/dispositivos', function(req, res) {
    pool.query('Select * from Dispositivos', function(err, result, fields) {
        if (err) {
            res.send(err).status(400)
            return
        }
        res.send(result).status(200)
    })
})

routerDispositivos.get('/ultima_medicion/:id', function(req, res) {
    const idDispositivo = req.params.id;
    const sql = 'SELECT * FROM Mediciones WHERE dispositivoId = ? ORDER BY fecha DESC LIMIT 1';
    pool.query(sql, [idDispositivo], function(err, result, fields) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).send(result);
    });
});

routerDispositivos.get('/mediciones/:id', function(req, res) {
    const idDispositivo = req.params.id;
    const sql = 'SELECT * FROM Mediciones WHERE dispositivoId = ?';
    pool.query(sql, [idDispositivo], function(err, result, fields) {
        if (err) {
            res.status(400).send(err);
            return;
        }
        res.status(200).send(result);
    });
});

routerDispositivos.get('/obtener_estado_valvula/:dispositivoId', async (req, res) => {
    const dispositivoId = req.params.dispositivoId;

    try {
        // 1) Obtener la electrovalvula asociada al dispositivo
        const electrovalvula = await new Promise((resolve, reject) => {
            pool.query(
                'SELECT electrovalvulaId FROM Dispositivos WHERE dispositivoId = ? LIMIT 1',
                [dispositivoId],
                (err, results) => {
                    if (err) {
                        console.error('Error al obtener electrovalvula:', err);
                        return reject(err);
                    }
                    if (results.length === 0) {
                        return resolve(null);
                    }
                    resolve(results[0]);
                }
            );
        });

        if (!electrovalvula) {
            return res.status(404).json({ error: 'No se encontró electrovalvula para este dispositivo' });
        }

        // 2) Obtener el estado actual (apertura) de esa electrovalvula
        const log = await new Promise((resolve, reject) => {
            pool.query(
                'SELECT apertura FROM Log_Riegos WHERE electrovalvulaId = ? ORDER BY fecha DESC LIMIT 1',
                [electrovalvula.electrovalvulaId],
                (err, results) => {
                    if (err) {
                        console.error('Error al obtener estado actual:', err);
                        return reject(err);
                    }
                    if (results.length === 0) {
                        return resolve(null);
                    }
                    resolve(results[0]);
                }
            );
        });

        if (!log) {
            return res.send(String('0'));

            
        }

        // 3) Devolver el valor de apertura
        res.send(String(log.apertura));

    } catch (error) {
        console.error('Error general en obtener_estado_valvula:', error);
        res.status(500).send('Error al obtener el estado de la válvula');
    }
});

routerDispositivos.get('/actualizar_medicion/:dispositivoId/:humedad/:estadoValvula', async (req, res) => {

    const dispositivoId = req.params.dispositivoId;
    const humedad = req.params.humedad;
    const estadoValvula = Number(req.params.estadoValvula);
    const fechaActual = new Date();

    try {
        // 1) Obtener la electrovalvula asociada
        const valvulaId = await new Promise((resolve, reject) => {
            pool.query(
                'SELECT electrovalvulaId FROM Dispositivos WHERE dispositivoId = ? LIMIT 1',
                [dispositivoId],
                (err, results) => {
                    if (err) return reject(err);
                    if (results.length === 0) return reject(new Error('No se encontró electrovalvula'));
                    resolve(results[0].electrovalvulaId);
                }
            );
        });

        // 2) Insertar nuevo estado en Log_Riegos
        await new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, ?, ?)',
                [estadoValvula, fechaActual, valvulaId],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        // 3) Insertar nueva medición
        await new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO Mediciones (fecha, valor, dispositivoId) VALUES (?, ?, ?)',
                [fechaActual, humedad, dispositivoId],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        res.json({ mensaje: "Actualización ok" });  // Envía JSON

    } catch (error) {
        console.error('Error al actualizar medición:', error.message || error);
        res.status(500).json({ error: error.message || error });
    }
});

module.exports = routerDispositivos
