const{ dataBase } = require('../../components');

const getAllOrders = async(req, res) => {
    try {
        const {limit, index} = req.query;
        const response = await dataBase.orders.findMany({
            take: Number(limit) || undefined,
            skip: Number(index) || undefined,
            where: {
                userId: req.session.user.id
            },
            select: {                
                orderDate: true,
                streetAddress: true,
                postalCode: true,
                state: true,
                country: true,
                subtotal: true,
                shipping: true,
                Total: true,
                orderItems:{
                    select:{
                        book:{
                            select: {
                                author: {select: {fullName:true}},
                                Title: true,
                                ISBN: true,
                                Genre: true,
                                PublishDate: true,
                                Price: true,
                                Condition: true
                            }
                        },
                        price: true,
                        Quantity: true
                    }
                }
            },
        });
        return res.status(200).json({orders: response})
    } catch (error) {
        console.log("getAllOrders:: Exception ", error);
        return res.status(503).json({message: "Something went wrong"});
    }
}
module.exports ={getAllOrders}