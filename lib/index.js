import MealsHandler from './meals/mealsHandler'
import './main.scss'

const handler = new MealsHandler()
handler.populate()
handler.listen()
