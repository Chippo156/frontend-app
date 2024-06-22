import { Injectable } from '@angular/core';
import { environtment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderDTO } from '../dtos/orderDto';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiOrderBase = `${environtment.apiBaseUrl}/orders`;
  private apiOrderDetailBase = `${environtment.apiBaseUrl}/order-details`;

  constructor(private http: HttpClient, private userService: UserService) {}

  placeOrder(orderDTO: OrderDTO): Observable<any> {
    return this.http.post(this.apiOrderBase, orderDTO, {});
  }
  getAllOrders(keyword: string, page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(this.apiOrderBase, { params });
  }
  getOrderDetail(orderId: number): Observable<any> {
    return this.http.get(`${this.apiOrderDetailBase}/order/${orderId}`);
  }
  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiOrderBase}/${id}`);
  }
  deleteOrderDetail(id: number): Observable<any> {
    return this.http.delete(`${this.apiOrderDetailBase}/${id}`);
  }
  countQuantityProductInOrder(): Observable<any> {
    return this.http.get(`${this.apiOrderDetailBase}/countQuantity`);
  }
}
