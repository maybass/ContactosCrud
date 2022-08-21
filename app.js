const express= require('express')
const app= express()
const mysql = require('mysql')
const hbs=require('hbs')


app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))


hbs.registerPartials(__dirname + '/views/partials')


const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'agenda'
})

connection.connect((err)=> {
	if(err) throw err
	console.log('Base de datos esta conectada')
})



app.get('/', (req,res)=> {
	let sql = "SELECT * FROM contactos"
	connection.query(sql,(err,data)=> {
		if(err) throw err;
		res.render('index', {
		titulo: 'Home',
		data : data 
		
		
	})
		
		
		
	})
	
	
})

app.get('/agregar-contacto', (req,res)=> {
	res.render('agregar-contacto' , {
		titulo: "Agregar Contacto"
		
	})
	
})


app.post('/agregar-contacto' ,(req, res)=> {
	let sql = "INSERT INTO contactos SET ? "
	let datos = req.body
	connection.query(sql, [datos] , (err,data)=> {
		if(err) throw err;
		res.redirect('/')
		
	})
	
	
	
})

app.post('/borrar-contacto' ,(req,res) => {
	const id=req.body.id
	let sql="DELETE FROM contactos WHERE id = ?"
	
	connection.query(sql, [id], (err,data)=> {
		res.redirect('/')
		
	})
	
})


app.get('/editar-contacto/:id' , (req,res)=> {
	let id= req.params.id
	let sql="SELECT * FROM contactos WHERE id = ?"
	connection.query(sql, [id], (err,data)=> {
		if(err) throw err;
		res.render('editar-contacto', {
			titulo: `Editando contacto ${id}`,
			data: data[0]
			
			
		})
		
		
	})
	
	
})

app.post('/editar-contacto/:id', (req,res) => {
	let id = req.params.id // lo primero es tomar el id de la url
	let cuerpoForm = req.body //tomar la info del cuerpo del form
	
	let sql = "UPDATE contactos SET ? WHERE id = ? "
	connection.query(sql, [cuerpoForm, id] , (err,data) => {
		if(err) res.send (`Ocurrio el siguiente error ${err.code}`);
		console.log(data.affectedRows + " registro actualizado ")
		
		
	})
	
	res.redirect('/')
	//producto editado con exito como hacerlo con res .redirect?	
})


	
app.use((req,res)=> {
	
	res.status(404).render('404', {
		titulo : '404 - NOT FOUND'
		
	})
})



app.listen(3000,()=>{
	console.log('Servidor online')
})