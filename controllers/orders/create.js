const{ dataBase } = require('../../components');
const {validateAndBuildOrderObj} = require("./validators")

const {Prisma} = require('@prisma/client');

const required_fields = ["streetAddress","postalCode","state","country", "orderDetails"]

const updateinventory = async (orders) =>{
    try {
        const result = await dataBase.$transaction(async (tx) => {
            let _data = []
            // for(let _order of orders){
                //update stock
                const _promise= orders.map(async (_order)=>{
                    let _invtry = await tx.inventory.update({
                        where: {bookId: _order.id},
                        data:{
                            stockAvailable:{decrement: _order.qty},
                            stockUsed: {increment: _order.qty},
                            version: {increment: 1}
                        }
                       })
                    // check if stock below zero
                    if (_invtry.stockAvailable < 0){
                        throw new Error("Inventory ran out")
                    }
                    _data.push(_invtry);
            });
            await Promise.allSettled(_promise);
            // }
            return _data;

        },  {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
        })

        return result;
    } catch (error) {
        console.log("updateinventory:: Exception: ", error);
        return false;        
    }
}

const createOrders = async (order, _bookPriceMap, userId) => {
    // console.log("order items", orderItems);
    const ordersCreated = await dataBase.orders.create({
        data: {
            userId,
            orderDate : new Date().toISOString(),
            streetAddress: order.streetAddress,
            postalCode: order.postalCode,
            state: order.state,
            country: order.country,
            subtotal: _bookPriceMap.totalPrice,
            shipping : _bookPriceMap.totalPrice,
            Total : _bookPriceMap.totalPrice,
        }
    });
    let orderItems = order.orderDetails.map((_book) => {
        return {
            bookId: _book.id,
            price: _bookPriceMap.orders[_book.id],
            Quantity: _book.qty,
            ordersOrderId: ordersCreated.orderId
        };
        });

    const orderItemsCreated = await dataBase.orderItem.createMany({
        data: orderItems
    })
    return {orderItemsCreated, ordersCreated}
}

const createOrder = async (req, res) => {
    try {
        
        const _bookPriceMap = await validateAndBuildOrderObj(req.body, required_fields);
        if (_bookPriceMap.error === true) {
            return res.status(_validate.response.code).json({message: _validate.response.message})
        }
        
        // await dataBase.inventory.findMany({where:})) 
        const response  = await updateinventory(req.body.orderDetails); 
        if (response === false){
            return res.status(409).json({message: "Inventory Ran Out"});
        }
        const ordersCreated = await createOrders(req.body, _bookPriceMap, req?.session?.user?.id);
        return res.status(200).json({});
    } catch (error) {
        console.log("createOrder:: Expetion",error);
        return res.status(503).json({message: "something went wrong"});
    }
}

module.exports ={createOrder}