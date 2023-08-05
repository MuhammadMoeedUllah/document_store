const{ dataBase } = require('../../components');

const invalidParams = (message) => {
    return {error: true, response: { message, code: 422}}

}

const validateAndBuildOrderObj = async (reqBody, required_fields) => {
    try {
        const books = reqBody.orderDetails.map( _item => _item?.id )

        for(let _field of required_fields){
            if (!(_field in reqBody)){
                return invalidParams("Missing Params")
            }
        }
        if (books?.length === 0 ) {
            return invalidParams( "Empty Order");
        }

        let data = await dataBase.books.findMany({where: {id: {in: books}}, select:{id:true, Price:true}});
        if (data?.length !== books?.length){
            return invalidParams ("Invalid Request");
        }
        let response = {error: false, orders: {}};
        let totalPrice = 0;
        for (let _item of data){
            response.orders[_item.id] = _item.Price;
            totalPrice+=_item.Price;
        }

        return  {...response, totalPrice}
            
    } catch (error) {
        console.log("validateCreateOrder::Exception: ", error);
        return invalidParams("Invalid Values");
    }
}

module.exports = {validateAndBuildOrderObj};