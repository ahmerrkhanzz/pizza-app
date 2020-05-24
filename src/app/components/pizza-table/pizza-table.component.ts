import { Component, OnInit } from '@angular/core';
import { PizzaTableService } from './pizza-table.service';
import { PizzaSizes, Toppings } from 'src/app/interfaces/pizza';

@Component({
  selector: 'app-pizza-table',
  templateUrl: './pizza-table.component.html',
  styleUrls: ['./pizza-table.component.scss']
})
export class PizzaTableComponent implements OnInit {
  public pizzaSizes: PizzaSizes[]
  public toppings: Toppings[]
  public vegToppings: any[] = []
  public nonVegToppings: any[] = []
  public subTotals = {
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0
  }
  public totals = { ...this.subTotals }
  public offers = {
    offer1: 5,
    offer2: 9,
    offer3: 0
  }
  public totalCurrency: string = '$'
  public totalSmall: number = 0
  public selectedToppings = []
  public showOffer1: boolean = false
  public showOffer2: boolean = false
  public showOffer3: boolean = false

  constructor(
    private _pizzaService: PizzaTableService
  ) { }

  ngOnInit() {
    this.getPizzasData()
  }

  getPizzasData() {
    this._pizzaService.getPizzaData().subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.pizzaSizes = res.pizzaSizes
        this.toppings = res.toppings
        this.vegToppings = this.toppings.filter(e => e.category === 'Veg Toppings')
        this.nonVegToppings = this.toppings.filter(e => e.category === 'Non Veg Toppings')
      }
    })
  }

  changeSelection(event, item) {
    this.totalCurrency = item.currency
    if (item[event.target.name]) {
      this.subTotals[event.target.name] = this.subTotals[event.target.name] + item.price
      this.calculateTotal(event)
      if (event.target.name === 'medium' || event.target.name === 'large') {
        this.selectedToppings.push(item)
        this.checkOffer(event)
      }
    } else if (this.subTotals[event.target.name] > 0) {
      this.subTotals[event.target.name] = this.subTotals[event.target.name] - item.price
      this.calculateTotal(event)
      if (event.target.name === 'medium' || event.target.name === 'large') {
        let index = this.selectedToppings.map(function (e) { return e.name; }).indexOf(item.name)
        this.selectedToppings.splice(index, 1)
        this.checkOffer(event)
      }
    }
  }


  calculateTotal(event) {
    this.totals[event.target.name] = 0
    // console.log(this.subTotals[event.target.name].toFixed(0));

    if (this.subTotals[event.target.name].toFixed(0) > 0) {
      let pizzaPrice = this.pizzaSizes.filter(e => e.alias === event.target.name)
      this.totals[event.target.name] = this.subTotals[event.target.name] + pizzaPrice[0].price
    }
  }

  removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  checkOffer(event) {
    this.showOffer1 = false
    this.showOffer2 = false
    this.showOffer3 = false
    let originalToppings = this.removeDuplicates(this.selectedToppings, 'name')
    const mediumToppings = originalToppings.filter(e => e.medium)
    const largeToppingsA = originalToppings.filter(e => e.large && (e.name !== 'Pepperoni' && e.name !== 'Barbecue Chicken'))
    const largeToppingsB = originalToppings.filter(e => e.large && (e.name === 'Pepperoni' || e.name === 'Barbecue Chicken'))
    const largeToppingsC = originalToppings.filter(e => e.large)
    if (mediumToppings.length === 2) {
      this.showOffer1 = true
    } else if (mediumToppings.length === 4) {
      this.showOffer2 = true
    }

    if (largeToppingsB.length === 2 && !largeToppingsA.length) {
      this.showOffer3 = true
      this.offers.offer3 = this.totals[event.target.name] / 2
    } else if (largeToppingsA.length === 4) {
      this.showOffer3 = true
      this.offers.offer3 = this.totals[event.target.name] / 2
    } else if (largeToppingsC.length === 3) {
      if (largeToppingsC.filter(e => e.large && (e.name === 'Pepperoni' || e.name === 'Barbecue Chicken')).length === 1) {
        this.showOffer3 = true
        this.offers.offer3 = this.totals[event.target.name] / 2
      }
    }



  }

}
