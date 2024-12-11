import express from 'express'
import { getPost, postPost, eliminarPost } from './consulta.js'
import cors from 'cors'


const app = express()
const port = 3000


app.use(cors());
app.use(express.json());

app.get('/posts', async (req, res)=>{
    try {
        const obtener = await getPost()
        res.json(obtener);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los posts' });
    }
});

app.post("/posts", async (req,res)=>{
    const {titulo,url,descripcion,likes} = req.body
    await postPost(titulo,url,descripcion,likes)
    res.send("agregado con exito")
});


   


app.delete('/posts/:id', async (req, res)=> {
    const {id} = req.params
    try {
        const response = await eliminarPost(id);
        res.status(response.status).send(response.message);
    } catch (error) {
        res.status(500).send('Error al eliminar el post');
    }
});


app.listen(port, ()=> {
    console.log(`servidor corriendo en el http://localhost:${port}`)
})