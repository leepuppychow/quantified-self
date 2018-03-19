import MealsHandler from './mealsHandler'
import './meals.scss'

const handler = new MealsHandler()
handler.populate()
handler.listen()
