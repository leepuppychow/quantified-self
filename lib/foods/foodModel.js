class Food {

  constructor({ id, name, calories }) {
    this.id = id
    this.name = name
    this.calories = calories
  }

}

Food.sortOptions = {
  0: (a, b) => a.id - b.id,
  1: (a, b) => b.calories - a.calories,
  2: (a, b) => a.calories - b.calories,
}

export default Food
