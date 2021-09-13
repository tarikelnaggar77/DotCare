import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, CheckboxControlValueAccessor, CheckboxRequiredValidator } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Element {
  product: string;
  no: number;
  quantity: number;
  type: string;
}
const ELEMENT_DATA: Element[] = [
  { no: 1, product: 'Product 1', quantity: 1.0079, type: 'Type A' },
  { no: 2, product: 'Product 2', quantity: 4.0026, type: 'Type B' },
  { no: 3, product: 'Product 3', quantity: 6.941, type: 'Type C' },
  { no: 4, product: 'Product 4', quantity: 9.0122, type: 'Type D' },
  { no: 5, product: 'Product 5', quantity: 10.811, type: 'Type A' },
  { no: 6, product: 'Product 6', quantity: 12.0107, type: 'Type B' },
  { no: 7, product: 'Product 7', quantity: 14.0067, type: 'Type C' },
  { no: 8, product: 'Product 8', quantity: 15.9994, type: 'Type D' },
  { no: 9, product: 'Product 9', quantity: 18.9984, type: 'Type A' },
];

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit {
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  productCtrl = new FormControl();
  filteredProducts: Observable<string[]>;
  products: string[] = [];
  allProducts: string[] = ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'];
  @ViewChild('productInput') productInput: ElementRef<HTMLInputElement>;
  myForm: FormGroup;
  product: number;
  options: boolean;
  types = [];
  types1 = [{ id: 0, product: '' }, { id: 1, product: 'Type A' }, { id: 2, product: 'Type B' }];
  types2 = [{ id: 0, product: '' }, { id: 1, product: 'Type C' }, { id: 2, product: 'Type D' }];


  displayedColumns = ['product', 'quantity', 'type'];
  dataSource = new MatTableDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      warehouse: new FormControl('0'),
      types: new FormControl({ value: 0, disabled: true }),
      product: new FormControl(''),
      zeroBalance: new FormControl(''),
    })



    this.filteredProducts = this.productCtrl.valueChanges.pipe(
      startWith(null),
      map((product: string | null) => product ? this._filter(product) : this.allProducts.slice()));


    this.myForm.get("warehouse").valueChanges.subscribe(x => {
      console.log(x)
      if (x == 0) {
        this.myForm.get("types").disable();
        console.log(this.myForm.value)
      }
      if (x == 1) {
        this.myForm.get("types").enable()
        this.types = this.types1;
        this.myForm.get("types").setValue(0);
        console.log(this.myForm.value)

      }
      if (x == 2) {
        this.myForm.get("types").enable()
        this.types = this.types2;
        this.myForm.get("types").setValue(0);

        console.log(this.myForm.value)

      }
    })
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.products.push(value);
    }

    this.productCtrl.setValue(null);
  }

  remove(product: string): void {
    const index = this.products.indexOf(product);

    if (index >= 0) {
      this.products.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.products.push(event.option.viewValue);
    this.productInput.nativeElement.value = '';
    this.productCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allProducts.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
  }

  showValues() {
    console.log(this.productCtrl.value)
    if (this.myForm.get("product").value == 1) {
      this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    }
    else {
      const result = ELEMENT_DATA.filter(s => s.product.includes(this.myForm.get("productCtrl").value)
      );
      this.dataSource = new MatTableDataSource<Element>(result);
    }
  }
}
