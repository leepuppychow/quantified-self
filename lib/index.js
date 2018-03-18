import MealsHandler from './meals/mealsHandler'
import './index.scss'

const handler = new MealsHandler()
handler.populate()
handler.listen()
