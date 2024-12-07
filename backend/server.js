import express from 'express'
import pkg from 'pg'
import cors from 'cors'


const app = express()
const port = 3000

const {Pool} = pkg
const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'shin',
    database: 'likeme',
    allowExitOnIdle: true
});

app.use(cors());
app.use(express.json());

app.get('/posts', async (req, res)=>{
    const { rows } = await pool.query('SELECT * FROM posts')
    res.json(rows)
})

app.post('/posts', async (req,res)=> {
    const { titulo, img , descripcion } = req.body;

    if (!titulo || !img|| !descripcion) {
        return res.status(400).send('Todos los campos son necesarios');
    }

    const consulta = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)';
    const values = [titulo, img, descripcion, 0];

    try {
        await pool.query(consulta, values);
        res.status(201).send('Nuevo post añadido');
    } catch (error) {
        console.error('Error al agregar el post:', error);
        res.status(500).send('Error al agregar el post');
    }
})


app.delete('/posts/:id', async (req, res)=> {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Post no encontrado');
        }

        res.status(200).send('Post eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        res.status(500).send('Error al eliminar el post');
    }
})

app.listen(port, ()=> {
    console.log(`servidor corriendo en el http://localhost:${port}`)
})