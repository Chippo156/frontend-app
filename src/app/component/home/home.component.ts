import { AfterViewInit, Component, Injectable, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationExtras,
  Route,
  Router,
} from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environtment } from '../../environments/environment';
import { PaymentService } from '../../service/payment.service';
import { CommmentService } from '../../service/comment.service';
import { Comment } from '../../models/comment';
import { OrderService } from '../../service/order.service';
import { SoldProduct } from '../../responses/SoldProduct';
import { ProductImage } from '../../models/product.image';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
@Injectable()
export class HomeComponent implements OnInit {
  products: Product[] = [];
  productImage!: Product;
  productShowMore: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  checkShowMore: boolean = false;
  productId: number = 0;
  checkImage: boolean = false;
  soldQuantity: SoldProduct[] = [];
  comments: number = 0;
  listRating: Map<number, number> = new Map<number, number>();
  listComment: Map<number, number> = new Map<number, number>();
  constructor(
    private router: Router,
    private productService: ProductService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private commentService: CommmentService,
    private orderService: OrderService
  ) {
    this.selectedCategoryId = 0;
    this.keyword = '';
  }

  ngOnInit(): void {
    debugger;
    window.scrollTo(0, 0);
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.route.queryParams.subscribe((params) => {
      const paymentStatus = params['paymentStatus'];
      if (paymentStatus === '00') {
        alert('Thanh toán thành công');
        this.clearPaymentStatus();
      } else if (paymentStatus === '01') {
        alert('Thanh toán thất bại');
        this.clearPaymentStatus();
      }
    });
    this.getCountQuantityProduct();
  }
  clearPaymentStatus() {
    const navigationExtras: NavigationExtras = {
      replaceUrl: true, // Replace the current URL in the history
    };
    this.router.navigate(['/'], navigationExtras);
  }
  getProducts(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ) {
    this.productService
      .getProducts(keyword, selectedCategoryId, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          response.productResponses.forEach((product: Product) => {
            let flag = 0;
            product.product_images.forEach((product_images: ProductImage) => {
              if (flag === 1) {
                product.url = `${environtment.apiBaseUrl}/products/viewImages/${product_images.image_url}`;
              } else if (flag === 2) {
                return;
              }
              flag++;
            });
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
            this.comments = response.comments;
          });
          this.products = response.productResponses;
          this.totalPages = response.totalPages;
        },
        complete: () => {
          debugger;
          // this.getRating();
          this.getProductsRating();
        },
        error: (error) => {
          debugger;
          console.log(error);
        },
      });
  }
  checkShowMoreProducts() {
    ++this.currentPage;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.productShowMore = this.products;
    this.checkShowMore = true;
  }
  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }
  searchProduct() {
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getRatingProductId(productId: number): any[] {
    const rating = this.listRating.get(productId) as number;

    if (isNaN(rating) || rating === undefined) {
      return Array(4);
    }
    return Array(Math.round(rating));
  }
  getEvaluationProductId(productId: number): number {
    return this.listComment.get(productId)!;
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
  hoveredProductId: number | null = null;
  hoveredImage: string | null = null;

  hoverImageToImage(productId: number) {
    this.hoveredProductId = productId;
    this.getImageFromHover(productId);
  }
  hoverOutImage() {
    this.hoveredProductId = null;
    this.hoveredImage = null;
  }

  getImageFromHover(productId: number) {
    const product = this.products.find((product) => product.id === productId);
    const productShowMore = this.productShowMore.find(
      (product) => product.id === productId
    );
    if (product) {
      this.hoveredImage = `${environtment.apiBaseUrl}/products/viewImages/${product.thumbnail}`;
    }
    if (productShowMore) {
      this.hoveredImage = `${environtment.apiBaseUrl}/products/viewImages/${productShowMore.thumbnail}`;
    }
  }
  getProductsRating() {
    this.productService.getProductsRating().subscribe({
      next: (response: any) => {
        debugger;
        response.forEach((data: any) => {
          this.listRating.set(data.product_id, data.rating);
          this.listComment.set(data.product_id, data.evaluation);
        });
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
}
