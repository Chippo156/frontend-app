import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product.image';
import { environtment } from '../../environments/environment';
import { Category } from '../../models/category';
import { CartService } from '../../service/cart.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SoldProduct } from '../../responses/SoldProduct';
import { OrderService } from '../../service/order.service';
import { CommmentService } from '../../service/comment.service';
import { Color } from '../../models/colors';
import { style } from '@angular/animations';
import { CommentImage } from '../../models/comment.image';
import { Comment } from '../../models/comment';
import { Size } from '../../models/sizes';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: ActivatedRoute,
    private route: Router,
    private orderService: OrderService,
    private commentService: CommmentService
  ) {}
  productCheckColor: Product[] = [];
  checkShowMore: boolean = false;
  product!: Product;
  productId: number = 1;
  currentImageIndex: number = 0;
  quantity: number = 1;
  quantityChange = new EventEmitter<number>();
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  soldQuantity: SoldProduct[] = [];
  listRating: Map<number, number> = new Map<number, number>();
  priceSize: number = 0;
  selectedSize: string = '';
  selectedColor: string = '';
  colors: Color[] = [];
  checkInfor: string = 'des';
  sizes: Size[] = [];
  comments: Comment[] = [];
  ngOnInit() {
    debugger;
    window.scrollTo(0, 0);
    this.getProductDetails(0);
    this.getCountQuantityProduct();
  }
  getProductDetails(id: number) {
    debugger;
    const idParam = this.router.snapshot.paramMap.get('id');
    if (id !== 0) {
      this.productId = id;
    }
    if (idParam !== null && id === 0) {
      this.productId = parseInt(idParam!);
    }
    if (!isNaN(this.productId)) {
      this.productService.getProductDetails(this.productId).subscribe({
        next: (response: any) => {
          debugger;
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_images: ProductImage) => {
              product_images.image_url = `${environtment.apiBaseUrl}/products/viewImages/${product_images.image_url}`;
            });
          }
          if (response.product_sale === null) {
            response.product_sale = {
              id: 0,
              description: '',
              sale: 0,
              newProduct: true,
              startDate: new Date(),
              endDate: new Date(),
            };
          }
          debugger;

          this.product = response;
          this.showImage(0);
        },
        complete: () => {
          debugger;
          this.getProductDetailSizes();
          // this.clickSize(this.selectedSize);
          this.getProductByCategory(this.product.category_id);
          this.getCommentByProductId(this.product.id);
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
    } else {
      console.log('Product ID is not a number', idParam);
    }
  }
  showImage(index: number) {
    debugger;
    if (
      this.product &&
      this.product.product_images &&
      this.product.product_images.length > 0
    ) {
      if (index < 0) {
        this.currentImageIndex = 0;
      } else if (index >= this.product.product_images.length) {
        this.currentImageIndex = this.product.product_images.length - 1;
      } else {
        this.currentImageIndex = index;
      }
    }
  }
  nextImage() {
    debugger;
    this.showImage(this.currentImageIndex + 1);
  }
  priviousImage() {
    debugger;
    this.showImage(this.currentImageIndex - 1);
  }
  thumbnailClick(index: number) {
    debugger;
    this.showImage(index);
  }
  increaseQuantity() {
    debugger;
    this.quantity++;
  }
  decreaseQuantity() {
    debugger;
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    debugger;
    if (this.product) {
      this.cartService.addToCart(
        this.productId,
        this.quantity,
        this.selectedSize
      );
    } else {
      console.log('Cannot add cart because product is not available');
    }
  }

  getProductDetail(productId: number) {
    this.route.navigate(['/products', productId]);
    setTimeout(() => {
      this.getProductDetails(0);
      window.scrollTo(0, 0);
    }, 10);
  }

  reviewRating(rating: number) {
    return Array(rating);
  }
  getRatingProductId(productId: number): any[] {
    const rating = this.listRating.get(productId) as number;

    if (isNaN(rating) || rating === undefined) {
      return Array(4);
    }
    return Array(Math.round(rating));
  }
  getCountQuantityProduct() {
    this.orderService.countQuantityProductInOrder().subscribe({
      next: (response: any) => {
        debugger;
        response.forEach((product: SoldProduct) => {
          this.soldQuantity.push(product);
        });
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
  getSoldQuantity(productId: number): number {
    const product = this.soldQuantity.find(
      (product) => product.productId === productId
    );
    return product ? product.count : 0;
  }
  formatQuantity(quantity: number): string {
    return quantity > 1000
      ? (quantity / 1000).toFixed(1) + 'k'
      : quantity.toString();
  }
  clickSize(size: string) {
    debugger;
    console.log(size);
    this.selectedSize = size;
    this.priceSize = this.sizes.find((s) => s.size === size)!.priceSize;
  }
  clickColor(color: string) {
    debugger;
    if (this.selectedColor !== color) {
      this.productCheckColor.find((product) => product.color.code === color)!;
      this.colors = [];
      this.getProductDetails(
        this.productCheckColor.find((product) => product.color.code === color)!
          .id
      );
      this.selectedColor = this.product.color.code;
    }
  }
  getProductByCategory(categoryId: number) {
    this.productService.getProductByCategoryId(categoryId).subscribe({
      next: (response: any) => {
        this.productCheckColor = response.productResponses;
        debugger;
      },
      complete: () => {
        this.getColorsProductDetails();
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }

  getColorsProductDetails() {
    debugger;
    this.productCheckColor.forEach((product: Product) => {
      if (product) {
        this.colors.push(product.color);
      }
    });
  }
  getProductDetailSizes() {
    debugger;
    if (this.product) {
      this.productService.getProductDetailSizes(this.product.id).subscribe({
        next: (response: any) => {
          debugger;
          this.sizes = response;
        },
        complete: () => {
          this.clickSize(this.sizes[0].size);

          debugger;
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
    }
  }
  checkInforProduct(infor: string) {
    const element1 = document.getElementById('des');
    const element2 = document.getElementById('review');
    const element3 = document.getElementById('infor');

    if (infor === 'des') {
      this.checkInfor = 'des';
      element1?.classList.add('activeInfor');
      element2?.classList.remove('activeInfor');
      element3?.classList.remove('activeInfor');
    }
    if (infor === 'review') {
      this.checkInfor = 'review';
      element2?.classList.add('activeInfor');
      element1?.classList.remove('activeInfor');
      element3?.classList.remove('activeInfor');
    }
    if (infor === 'information') {
      this.checkInfor = 'information';
      element3?.classList.add('activeInfor');
      element1?.classList.remove('activeInfor');
      element2?.classList.remove('activeInfor');
    }
  }
  getCommentByProductId(productId: number) {
    debugger;
    this.productService.getCommentByProductId(productId).subscribe({
      next: (response: any) => {
        this.comments = response;
      },
      complete: () => {
        debugger;
      },
      error: (response) => {
        debugger;
        console.log(response);
      },
    });
  }
}
