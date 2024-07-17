const axios = require('axios');

const keepAlive = () => {
    axios.get('https://course-follow-up-production.up.railway.app/')
        .then(response => {
            console.log('Manteniendo la aplicación activa:', response.data);
        })
        .catch(error => {
            console.error('Error al mantener la aplicación activa:', error);
        });
};

// Ejecutar cada 5 minutos
setInterval(keepAlive, 5 * 60 * 1000);

keepAlive();