import pkg from "pg";


const { Pool } = pkg;
const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'shin',
    database: 'likeme',
    allowExitOnIdle: true
});


export const getPost = async()=> {
    const { rows } = await pool.query('SELECT * FROM posts')
    return rows;
}


export const postPost = async (titulo,url,descripcion) => {
    try{
        const consulta = "INSERT INTO posts (titulo, img, descripcion, likes) values ( $1,$2,$3,$4)";
        const values = [titulo,url,descripcion,0];
        const result = await pool.query(consulta, values);
        console.log("Post agregado:", result)}
    catch(error){
        console.error("Error al agregar post", error.message);
    }

};


export const eliminarPost = async(id)=> {
    const consulta = "DELETE FROM posts WHERE id = $1";
    const values = [id];
    try {
        const result = await pool.query(consulta, values);

        if (result.rowCount === 0) {
            return { status: 404, message: 'Post no encontrado' };
        }

        return { status: 200, message: 'Post eliminado exitosamente' };
    } catch (error) {
        console.error('Error al eliminar el post:', error.message);
        return { status: 500, message: 'Error al eliminar el post' };
    }

}

export default {getPost, postPost, eliminarPost}