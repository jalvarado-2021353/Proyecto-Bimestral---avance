import Categories from "./categories.model.js"

export const save = async(req, res) => {
    try {
        const data = req.body
        const categories = new Categories(data)
        await categories.save()
        return res.send({success: true, message: `${categories.name} saved successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'General error when adding categories'})
    }
}

export const getAll = async(req, res)=>{
    try{
        const{ limit = 20, skip = 0 } = req.query
        const categories = await Categories.find()
        .skip(skip)
        .limit(limit)
        if (categories.length === 0) return res.status(404).send({message: 'Categories not found', success: false})
            return res.send(
                {
                    success: true,
                    message: 'Categories found: ', 
                    categories,
                    total: categories.length
                }
            )
    }catch(error){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

//Obtener 1 usuario por su ID
export const get = async(req, res)=>{
    try{
        const { id } = req.params
        const categories = await Categories.findById(id)

        if(!categories) return res.status(404).send(
            {
                sucess: false,
                message: 'Categories not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'Categories found',
                categories
            }
        )
    }catch(err){
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error', 
                err
            }
        )
    }
}

export const update = async (req,res) => {
    try {
        const id = req.params.id
        const data = req.body
        const update = await Categories.findByIdAndUpdate(id,data,{new:true})
        if (!update) return res.status(404).send({
            sucess: false,
            message: 'Categories not found'
        })
        return res.send({
            success: true,
            message: 'Categories Updated',
            update
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error', 
            err
        })
    }
}

export const deleteCategories = async(req, res)=>{
    try {
        const id = req.params.id
        const deleteCategories= await Categories.findByIdAndDelete(id)
        if (!deleteCategories)return res.status(404).send({Message: 'Categories not found'})
            return res.send({message: 'Categories deleted succesfully'})
    } catch (err) {
        console.console.log(err);
        return res.status(500).send({message: 'General Error',err})
    }   
}