//LÓGICA DE AUTENTICACIÓN
import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import Invoice from "../invoice/invoice.model.js";

//test
export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

//Register
export const register = async(req, res)=>{
    try{
        //Capturar los datos
        let data = req.body
        //Aquí van validaciones
        let user = new User(data)

        //Encriptar la password
        user.password = await encrypt(user.password)
        //Asignar rol por defecto
        user.role = 'CLIENT'
        //Guardar
        await user.save()
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username: ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'General error with registering user', err})
    }
}

//Login
// Login
export const login = async (req, res) => {
    try {
        // Capturar los datos del body
        let { username, password } = req.body;

        // Buscar usuario
        let user = await User.findOne({ username });
        if (!user) return res.status(400).send({ message: "Wrong email or password" });

        // Verificar contraseña
        if (!(await checkPassword(user.password, password))) {
            return res.status(400).send({ message: "Wrong email or password" });
        }

        // Datos del usuario que se envían
        let loggedUser = {
            uid: user._id,
            name: user.name,
            username: user.username,
            role: user.role
        };

        // Generar token
        let token = await generateJwt(loggedUser);

        // Buscar historial de compras del usuario
        let invoices = await Invoice.find({ user: user._id })
            .populate("products.product", "name price")
            .select("total status createdAt products");

        // Responder con los datos del usuario y su historial de compras
        return res.send({
            message: `Welcome ${user.name}`,
            loggedUser,
            token,
            purchaseHistory: invoices.length > 0 ? invoices : "No purchases yet"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "General error with login function", error: err.message });
    }
};

