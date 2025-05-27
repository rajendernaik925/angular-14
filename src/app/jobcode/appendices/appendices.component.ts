import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { AuthService } from 'src/app/auth.service';
declare var $: any;

@Component({
  selector: 'app-appendices',
  templateUrl: './appendices.component.html',
  styleUrls: ['./appendices.component.sass']
})
export class AppendicesComponent implements OnInit {

  resDAta: any[] = [];
  cartItems: any[] = [];
  selectedItemForPayment: any = null;
  @ViewChild('jobDialog', { static: true }) jobDialog!: TemplateRef<any>;
  @ViewChild('getSingleData', { static: true }) getSingleData!: TemplateRef<any>;
  private dialogRef: any;
  activeCategory: string = '';
  showCart = false;
  isLoading: boolean = false;
  GetData: any;
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.data();
  }

  data() {
    this.isLoading = true;
    this.authService.getData().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.resDAta = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log("error : ", err);
        this.isLoading = false;
      }
    })
  }


  addToCart(item: any, event:Event) {
    event.stopPropagation();
    this.cartItems.push(item);
    this.close();
  }

  buyNow(item: any, event: Event) {
    event.stopPropagation();
    this.selectedItemForPayment = item;
    this.dialogRef = this.dialog.open(this.jobDialog, {
      width: '600px',
      height: 'auto',
      hasBackdrop: true
    });

  }

  makePayment() {
    alert("Payment successful for: " + this.selectedItemForPayment.title);
    this.selectedItemForPayment = null;
  }

  close() {
    this.dialog.closeAll();
  }

  sortData(name: string) {
    this.isLoading = true;
    this.activeCategory = name; 

    this.resDAta = [];
    console.log(name);
    this.authService.getCategoryData(name).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.resDAta = res;
        console.log(res);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }


  toggleCart() {
    this.showCart = !this.showCart;
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }
  getInfo(item: any, event: Event) {
    event.stopPropagation();
    this.GetData = item;
    this.dialogRef = this.dialog.open(this.getSingleData, {
      width: 'auto',
      height: 'auto',
      hasBackdrop: true
    });
  }


alertMessage: string = '';
showAlert: boolean = false;

alert(message: string) {
  this.alertMessage = message;
  this.showAlert = true;

  // Auto dismiss after 4 seconds
  setTimeout(() => {
    this.showAlert = false;
  }, 4000);
}

closeAlert() {
  this.showAlert = false;
}



}
