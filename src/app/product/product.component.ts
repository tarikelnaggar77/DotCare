import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, CheckboxControlValueAccessor, CheckboxRequiredValidator } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of } from 'rxjs';
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
  { no: 1, product: 'Product 1', quantity: 0.000, type: 'Type A' },
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
  productCtrl = new FormControl(null, Validators.required);
  filteredProducts: Observable<string[]>;
  products: string[] = [];
  allProducts: string[] = [];
  @ViewChild('productInput') productInput: ElementRef<HTMLInputElement>;
  myForm: FormGroup;
  product: number;
  options: boolean;
  types = [];
  types1 = [{ id: 1, product: 'Type A' }, { id: 2, product: 'Type B' }];
  types2 = [{ id: 3, product: 'Type C' }, { id: 4, product: 'Type D' }];
  showTable: boolean;

  displayedColumns = ['product', 'quantity', 'type'];
  dataSource = new MatTableDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {

  }

  get typeFormControl() {
    return this.myForm.get("types");
  }

  constructor(private formBuilder: FormBuilder) {
    this.showTable = false;

    this.myForm = this.formBuilder.group({
      warehouse: new FormControl(null, Validators.required),
      types: new FormControl({ value: null, disabled: true }, Validators.required),
      product: new FormControl(1, Validators.required),
      zeroBalance: new FormControl(''),
    })

    this.myForm.get("types").valueChanges.subscribe(x => {
      this.products = [];
      this.showTable = false;
      this.allProducts = ELEMENT_DATA.filter(e => e.type == x).map(e => e.product)
      this.filteredProducts = of(this.allProducts);

    });



    this.filteredProducts = this.productCtrl.valueChanges.pipe(
      startWith(null),
      map((product: string | null) => product ? this._filter(product) : this.allProducts.slice()));


    this.myForm.get("warehouse").valueChanges.subscribe(x => {
      this.products = [];
      this.showTable = false;
      this.myForm.get("types").setValue(null);
      if (x == '1') {
        this.myForm.get("types").enable()
        this.types = this.types1;
      }

      else if (x == '2') {
        this.myForm.get("types").enable()
        this.types = this.types2;
      }

      else {
        this.myForm.get("types").disable();
      }
    })
  }

  formValid() {
    return this.myForm.invalid || (this.myForm.get('product').value == 0 && this.products.length == 0)
    // ((this.myForm.get("product").value == 1) || (this.myForm.get("product").value == 0 && this.products.length > 0))

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

    return ELEMENT_DATA.filter(x => x.type == this.myForm.get("types").value).map(
      e => e.product
    ).filter(e => e.toLowerCase().includes(filterValue));

  }

  ngOnInit(): void {

  }

  showZeroBalance() {
    const zeroB = this.myForm.get("zeroBalance").value;
    if (!zeroB) {
      return this.getByType().filter(x => x.quantity > 0)
    }
    return this.getByType();
  }

  getByType() {
    const T = this.myForm.get("types").value;
    return ELEMENT_DATA.filter(z => z.type == T);
  }

  showValues() {
    this.showTable = true;

    if (this.myForm.get("product").value == 1) {
      this.dataSource = new MatTableDataSource<Element>(this.showZeroBalance());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else {
      const result = this.showZeroBalance().filter(s => (this.products.includes(s.product))
      );

      this.dataSource = new MatTableDataSource<Element>(result);
    }
  }
}
