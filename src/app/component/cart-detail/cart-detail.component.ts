import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { environtment } from '../../environments/environment';
import { OrderResponse } from '../../responses/orderResponse';
import { OrderDTO } from '../../dtos/orderDto';
import { OrderService } from '../../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../responses/userResponse';
import { PaymentService } from '../../service/payment.service';
import { Window } from '@popperjs/core';
import { CouponService } from '../../service/coupon.service';
import { Size } from '../../models/sizes';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss'],
})
export class CartDetailComponent implements OnInit {
  orderForm!: FormGroup;
  checkLogin: boolean = false;
  orderId: number = 0;
  userName: string = '';
  phoneNumber: string = '';
  email: string = '';
  cartItems: { product: Product; quantity: number; size: string }[] = [];
  couponCode: string = '';
  checkAddCoupon: boolean = false;
  totalMoney: number = 0;
  subTotal: number = 0;
  discount: number = 0;
  selectedPayment: string = 'Thanh toán khi nhận hàng';
  address: string = '';
  selectedAddress: string = '';
  userResponse: UserResponse =
    this.userService.getUserResponseFromLocalStorage()!;
  selectedTranport: string = '';
  checkPayment: boolean = false;
  createPayment: any = {};
  homeUrl = window.location.href;
  size!: Size;
  orderDTO: OrderDTO = {
    user_id: 1,
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    order_status: '',
    total_money: 0,
    shipping_method: '',
    payment_method: '',
    shipping_address: 'hehe',
    tracking_number: '',
    cart_items: [],
  };

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private userService: UserService,
    private paymentService: PaymentService,
    private couponService: CouponService
  ) {
    this.orderForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.orderDTO.full_name = '';
    this.orderDTO.email = '';
    this.orderDTO.phone_number = '';
    this.orderDTO.address = '';
    this.orderDTO.note = '';
    this.orderDTO.order_status = 'Pending';
    this.orderDTO.total_money = 0;
    this.orderDTO.shipping_method = this.selectedTranport;
    this.orderDTO.payment_method = 'Cash';
    this.orderDTO.shipping_address = '';
    this.orderDTO.tracking_number = '';
  }
  ngOnInit(): void {
    debugger;
    window.scrollTo(0, 0);
    this.orderDTO.user_id = this.tokenService.getUserIdByToken();
    if (this.orderDTO.user_id !== 0) {
      this.checkLogin = true;
    }
    const cartSize1 = this.cartService.getCartSize1();
    let productIds = Array.from(cartSize1.keys());
    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductByIds(productIds).subscribe({
      next: (products: any) => {
        debugger;
        this.cartItems = [];

        productIds.forEach((productId) => {
          const product = products.productResponses.find(
            (p: Product) => p.id === productId
          );
          if (product) {
            product.url = `${environtment.apiBaseUrl}/products/viewImages/${product.thumbnail}`;
            if (product.product_sale === null) {
              product.product_sale = {
                id: 0,
                description: '',
                sale: 0,
                newProduct: true,
                startDate: new Date(),
                endDate: new Date(),
              };
            }
            let selectedSize = cartSize1.get(productId);
            //cartSize1: Map<number, Map<string, number>>
            if (selectedSize) {
              selectedSize.forEach((value, key) => {
                const productCopy = { ...product }; // copy the product
                this.size = product.product_sizes.find(
                  (s: any) => s.size === key
                );
                productCopy.price =
                  ((product.price * (100 - product.product_sale.sale)) / 100) *
                  (1 + this.size.priceSize / 100);
                this.cartItems.push({
                  product: productCopy,
                  quantity: value,
                  size: key,
                });
              });
            }
          }
        });
      },
      complete: () => {
        debugger;
        this.calculateTotalMoney();
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
  isCartEmpty(): boolean {
    if (this.cartItems.length === 0) {
      return false;
    }
    return true;
  }
  calculateTotalMoney() {
    this.totalMoney = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  getPaymentMethodAndShippingMethod() {
    let selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    );
    let selectedTranport = document.querySelector(
      'input[name="shipping"]:checked'
    );
    if (selectedTranport) {
      this.selectedTranport = (selectedTranport as HTMLInputElement).value;
    }
    if (selectedPayment) {
      this.selectedPayment = (selectedPayment as HTMLInputElement).value;
    }
  }
  placeOrder(): void {
    if (this.checkLogin) {
      if (
        this.orderForm.get('userName')?.value !== '' &&
        this.orderForm.get('email')?.value !== '' &&
        this.orderForm.get('phoneNumber')?.value !== '' &&
        this.orderForm.get('address')?.value !== ''
      ) {
        debugger;
        this.orderDTO.cart_items = this.cartItems.map((item) => {
          return { product_id: item.product.id, quantity: item.quantity };
        });
        this.getPaymentMethodAndShippingMethod();
        this.orderDTO.full_name = this.orderForm.get('userName')?.value;
        this.orderDTO.phone_number = this.orderForm.get('phoneNumber')?.value;
        this.orderDTO.email = this.orderForm.get('email')?.value;
        this.orderDTO.address = this.orderForm.get('address')?.value;
        this.orderDTO.payment_method = this.selectedPayment;
        this.orderDTO.shipping_method = this.selectedTranport;
        this.orderDTO.total_money = this.totalMoney;
        this.orderDTO.shipping_address = this.selectedAddress;

        this.orderService.placeOrder(this.orderDTO).subscribe({
          next: (response) => {
            debugger;
            this.orderId = response;
            if (
              response.payment_method === 'Thanh toán online qua cổng VNPay'
            ) {
              alert('Bạn chắc chắn thanh toán qua thẻ');
            }
            if (
              response.payment_method === 'Thanh toán tiền mặt' ||
              response.payment_method === 'POS'
            ) {
              this.router.navigate(['/']);
              this.cartService.clearCart();
            } else {
              this.paymentService
                .getCreatePayment('NCB', this.totalMoney, this.orderId)
                .subscribe({
                  next: (response) => {
                    debugger;
                    this.createPayment = response;
                    if (this.createPayment?.code === 'ok') {
                      window.location.href = this.createPayment.paymentUrl;
                    }
                  },
                  complete: () => {
                    debugger;
                    console.log(this.homeUrl);
                    if (this.createPayment?.code === 'ok') {
                      debugger;
                      const url = new URLSearchParams(window.location.search);
                      console.log(url);
                      this.paymentService.getInfoPayment(url).subscribe({
                        next: (response: any) => {
                          debugger;
                          alert(response);
                          this.router.navigate(['']);
                        },
                        complete: () => {
                          debugger;
                          alert(response);
                        },
                        error: (error: any) => {
                          debugger;
                          console.log(
                            'Error fetching data payment method: ',
                            error
                          );
                        },
                      });
                    }
                  },
                  error: (error) => {
                    debugger;
                    alert(`Lỗi khi tạo thanh toán ${error}`);
                  },
                });
            }
            // this.router.navigate(['/']);
            this.cartService.clearCart();
            alert('Order successfully');
          },
          complete: () => {
            debugger;
            this.calculateTotalMoney();
          },
          error: (error) => {
            debugger;
            alert(`Lỗi khi đặt hàng ${error}`);
          },
        });
      } else {
        alert('Vui lòng điền đầy đủ thông tin');
        this.orderForm.markAllAsTouched();
      }
    } else {
      alert('Bạn cần đăng nhập để thực hiện chức năng này');
      this.router.navigate(['/login']);
    }
  }
  CalculateCoupon() {
    if (this.checkAddCoupon === false) {
      this.checkAddCoupon = true;
      debugger;
      this.couponService.getCouponByCode(this.couponCode).subscribe({
        next: (response) => {
          debugger;
          if (response !== null) {
            this.discount = response.discount;
            this.totalMoney = this.totalMoney - response.discount;
          }
        },
        complete: () => {
          debugger;
        },
        error: (error) => {
          debugger;
          console.log('Error fetching data: ', error);
        },
      });
    }
  }
  extractCoupon() {
    this.checkAddCoupon = false;
    this.couponCode = '';
    this.totalMoney = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
}
