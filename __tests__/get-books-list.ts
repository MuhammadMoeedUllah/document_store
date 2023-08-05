const {dataBase} = require( '../components/db')
const {books } = require( '../controllers')

const resposneObject = {
    status:  (code)=> {return {json: (message)=> {return message}}}
}

const requestObject = {
    query: {}
}
beforeAll(async () => {
  // create product categories
  const author1 = await dataBase.authors.create({
    data: { fullName: 'Wand' }
  })
  const author2 = await dataBase.authors.create({
    data:  { fullName: 'Broomstick' },
  })
  
  const pub1 = await dataBase.publishers.create({
    data: { country: 'Finland' },
  })

  await dataBase.user.createMany({
    data: [{ email: 'email@email.com' , name: 'adeel', password: 'password'}],
  })

  await dataBase.books.createMany({
    data: [
        { authorId: 1 , publishersId: pub1.id, Title: "Mybook", ISBN: "1234321", Genre: "Drama", 
        PublishDate:new Date(), Price: 100, Condition: "New"},
        { authorId: 2 , publishersId: pub1.id, Title: "My 2nd book", ISBN: "45654", Genre: "Thriller", 
        PublishDate:new Date(), Price: 85, Condition: "Used"}
    ],
  })


  console.log('✨ Data successfully created!')

})

afterAll(async () => {
  const deleteBooks = dataBase.books.deleteMany()
  const deletePublishers = dataBase.publishers.deleteMany()
  const deleteAuthors =dataBase.authors.deleteMany()
  const deleteUser = dataBase.user.deleteMany()
  const deleteOrderItem = dataBase.orderItem.deleteMany()
  const deleteOrder = dataBase.orders.deleteMany()

  await dataBase.$transaction([
    deleteBooks,
    deletePublishers,
    deleteAuthors,
    deleteUser,
    deleteOrderItem,
    deleteOrder
])

  await dataBase.$disconnect()
})

it('should create 1 new customer with 1 order', async () => {
  // The new customers details
  const req ={
    session: {user: {id: 1}},
    body:{
    }
  }
  const data = await books.getList(requestObject,resposneObject)
  // Expect the new customer to have been created and match the input
  expect(data).toHaveLength(2)
})
