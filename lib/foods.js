import FoodsHandler from './foods/foodsHandler'
import './main.scss'

const handler = new FoodsHandler()
handler.populate()
handler.listen()
