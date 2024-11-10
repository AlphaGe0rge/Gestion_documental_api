const express = require('express');
const cors = require('cors');

const Role = require('./role');
const User = require('./user');
const Case = require('./case');
const Document = require('./document');
const Folder = require('./folder');

require('./relations')

const db = require('../db/connection');
const bodyParser = require('body-parser');
const path = require('path');

class Server {

    constructor(){
        
        this.app = express();
        this.port = process.env.PORT;
        this.documentPath = '/api/documents';
        this.authPath = '/api/auth';
        this.casePath = '/api/cases';
        this.rolePath = '/api/roles';

        //conexión a la base de datos
        this.dbConnection();

        //middlewares (se ejecutaran a penas subamos nuestra aplicación)
        this.middlewares();

        //rutas
        this.routes();
    }

    async dbConnection() {

        try {
            
            await db.authenticate();
            console.log('Database online');

            await db.sync({ force: false }); // Cambia a `true` si quieres recrear las tablas cada vez
            console.log('Database synchronized');

        } catch (err) {
            throw new Error(err);
        }

    }

    middlewares() {

        //cors
        this.app.use(cors()); //esto del cors es usado para evitar problemas a futuro con los llamados a base datos

        //lectura y parseo del body
        this.app.use(express.json()) // esto nos sirve para convertir en json los datos que vengan en la req, ya sea un post, un put, un delete

        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
        //directorio publico
        // this.app.use(express.static('public')) //lo que este dentro del index.html se mostrara en la pagina principal (sin path)

        this.app.use(bodyParser.urlencoded({extended: true}))

    }

    routes() {
        this.app.use(this.documentPath, require('../routes/document'));
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.casePath, require('../routes/case'));
        this.app.use(this.rolePath, require('../routes/role'));
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log(`corriendo en el puerto ${this.port}`);
        })
    }

}

module.exports = Server;