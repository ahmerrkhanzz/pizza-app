export interface PizzaSizes {
  name: string,
  alias: string,
  price: number,
  currency: string,
  size: string
}

export interface Toppings {
  name: string,
  price: number,
  currency: string,
  category: string,
  value?: number
}
