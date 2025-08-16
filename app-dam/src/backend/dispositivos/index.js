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

routerDispositivos.get('/actualizar_riego/:dispositivoId/:humedad', async (req, res) => {
    const dispositivoId = req.params.dispositivoId;
    const humedad = req.params.humedad;
    const fechaActual = new Date();

    console.log(`Inicio actualizar_riego para dispositivoId=${dispositivoId} con humedad=${humedad}`);

    try {
        // 1) Obtener electrovalvulas asociadas al dispositivo
        const electrovalvulas = await new Promise((resolve, reject) => {
            pool.query(
                'SELECT electrovalvulaId FROM Dispositivos WHERE dispositivoId = ?',
                [dispositivoId],
                (err, results) => {
                    if (err) {
                        console.log('Error al obtener electrovalvulas:', err);
                        reject(err);
                    }
                    else {
                        console.log(`Electrovalvulas encontradas: ${JSON.stringify(results)}`);
                        resolve(results);
                    }
                }
            );
        });

        if (electrovalvulas.length === 0) {
            console.log('No se encontraron electrovalvulas para este dispositivo');
            return res.status(404).send('No se encontraron electrovalvulas para este dispositivo');
        }

        // 2) Para cada electrovalvula hacer toggle en Log_Riegos
        for (const ev of electrovalvulas) {
            console.log(`Procesando electrovalvulaId=${ev.electrovalvulaId}`);

            // Obtener estado actual para hacer toggle
            const log = await new Promise((resolve, reject) => {
                pool.query(
                    'SELECT apertura FROM Log_Riegos WHERE electrovalvulaId = ? ORDER BY fecha DESC LIMIT 1',
                    [ev.electrovalvulaId],
                    (err, results) => {
                        if (err) {
                            console.log('Error al obtener estado actual:', err);
                            reject(err);
                        }
                        else {
                            console.log(`Estado actual encontrado: ${JSON.stringify(results[0])}`);
                            resolve(results[0]);
                        }
                    }
                );
            });

            const nuevoEstado = log && log.apertura === 1 ? 0 : 1;
            console.log(`Nuevo estado para electrovalvulaId=${ev.electrovalvulaId}: ${nuevoEstado}`);

            await new Promise((resolve, reject) => {
                pool.query(
                    'INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, ?, ?)',
                    [nuevoEstado, fechaActual, ev.electrovalvulaId],
                    (err) => {
                        if (err) {
                            console.log('Error al insertar Log_Riegos:', err);
                            reject(err);
                        }
                        else {
                            console.log(`Log_Riegos insertado para electrovalvulaId=${ev.electrovalvulaId}`);
                            resolve();
                        }
                    }
                );
            });
        }

        // 3) Insertar nueva medicion con humedad
        await new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO Mediciones (fecha, valor, dispositivoId) VALUES (?, ?, ?)',
                [fechaActual, humedad, dispositivoId],
                (err) => {
                    if (err) {
                        console.log('Error al insertar Mediciones:', err);
                        reject(err);
                    }
                    else {
                        console.log('Medicion insertada correctamente');
                        resolve();
                    }
                }
            );
        });

        res.status(200).send('Riego actualizado y medicion registrada');

    } catch (error) {
        console.error('Error general en actualizar_riego:', error);
        res.status(500).send('Error al actualizar riego y medicion');
    }
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

// routerDispositivos.get('/actualizar_medicion/:dispositivoId/:humedad/:valvulaId/:estadoValvula', async (req, res) => {
//     const dispositivoId = req.params.dispositivoId;
//     const humedad = req.params.humedad;
//     const valvulaId = req.params.valvulaId;
//     const estadoValvulaActual = Number(req.params.estadoValvula);
//     const fechaActual = new Date();

//     console.log(`Inicio actualizar_riego para dispositivoId=${dispositivoId} con humedad=${humedad} y valvulaId=${valvulaId}`);

//     try {
//         // Insertar nuevo estado en Log_Riegos
//         await new Promise((resolve, reject) => {
//             pool.query(
//                 'INSERT INTO Log_Riegos (apertura, fecha, electrovalvulaId) VALUES (?, ?, ?)',
//                 [estadoValvulaActual, fechaActual, valvulaId],
//                 (err) => {
//                     if (err) {
//                         console.error('Error al insertar Log_Riegos:', err);
//                         return reject(err);
//                     }
//                     console.log(`Log_Riegos insertado para electrovalvulaId=${valvulaId}`);
//                     resolve();
//                 }
//             );
//         });

//         // Insertar nueva medición
//         await new Promise((resolve, reject) => {
//             pool.query(
//                 'INSERT INTO Mediciones (fecha, valor, dispositivoId) VALUES (?, ?, ?)',
//                 [fechaActual, humedad, dispositivoId],
//                 (err) => {
//                     if (err) {
//                         console.error('Error al insertar Mediciones:', err);
//                         return reject(err);
//                     }
//                     console.log('Medición insertada correctamente');
//                     resolve();
//                 }
//             );
//         });

//         res.status(200).send('Riego actualizado y medición registrada');
//     } catch (error) {
//         console.error('Error general en actualizar_riego:', error);
//         res.status(500).send('Error al actualizar riego y medición');
//     }
// });

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
