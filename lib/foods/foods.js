import FoodsHandler from './foodsHandler'
import './foods.scss'

const handler = new FoodsHandler()
handler.populate()
handler.listen()
