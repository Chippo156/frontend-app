import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiGetProducts = `${environtment.apiBaseUrl}/products`;
  private apiGetColors = `${environtment.apiBaseUrl}/colors`;
  products: Product[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;

  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  constructor(private http: HttpClient, private router: Router) {}
  getProducts(
    keyword: string,
    category_id: number,
    page: number,
    limit: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', category_id)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Product[]>(this.apiGetProducts, { params });
  }
  getProductDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiGetProducts}/${id}`);
  }
  getProductByIds(productIds: number[]): Observable<any> {
    debugger;
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, {
      params,
    });
  }
  getProductByCategoryId(categoryId: number): Observable<any> {
    const params = new HttpParams().set('categoryId', categoryId.toString());
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-category`, {
      params,
    });
  }
  getProductByCategoryName(categoryName: string): Observable<any> {
    const params = new HttpParams().set('categoryName', categoryName);
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-category-name`, {
      params,
    });
  }
  getCodeColors(): Observable<any> {
    return this.http.get(`${this.apiGetColors}/codes`);
  }
  getProductsRating(): Observable<any> {
    return this.http.get(`${this.apiGetProducts}/rating-products`);
  }
  getProductDetailSizes(id: number): Observable<any> {
    return this.http.get(`${this.apiGetProducts}/sizes/${id}`);
  }
  getCommentByProductId(id: number): Observable<any> {
    return this.http.get(`${this.apiGetProducts}/comments/${id}`);
  }
}
