const{ dataBase } = require('../../components');

const getList = async (req, res) => {
    try {
        const {limit, index} = req.query;

        const books = await dataBase.books.findMany({
            take: Number(limit) || undefined,
            skip: Number(index) || undefined,
            include: {
                "author":{select:{fullName: true}}, 
                "Inventory":{select:{stockAvailable: true}}, 
                "publisher": {select:{country: true}}}
        });
        return res.status(200).json(books);
    } catch (error) {
        console.log("books::getList:: Exception",error)
        return res.status(503).json({message: "Something went wrong"})
    }
}

module.exports ={getList}