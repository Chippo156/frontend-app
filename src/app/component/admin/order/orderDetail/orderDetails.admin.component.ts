import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OrderResponse } from '../../../../responses/orderResponse';
import { OrderService } from '../../../../service/order.service';
import { OrderDetail } from '../../../../models/orderDetail';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details-admin',
  templateUrl: './orderDetails.admin.component.html',
  styleUrls: ['./orderDetails.admin.component.scss'],
})
export class OrderDetailsAdminComponent implements OnInit {
  orderDetails: OrderDetail[] = [];
  orderDetailId: number = 0;
  id = this.activeRoute.snapshot.paramMap.get('id')!;

  constructor(
    private orderService: OrderService,
    private activeRoute: ActivatedRoute
  ) {
    debugger;
  }
  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id')!;
    debugger;

    this.getOrderDetail(parseInt(id));
  }
  getOrderDetail(orderId: number) {
    debugger;
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (response: OrderDetail[]) => {
        this.orderDetails = response;
        debugger;
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
  onRemove(orderDetailId: number) {
    this.orderDetailId = orderDetailId;
    this.orderService.deleteOrderDetail(orderDetailId).subscribe({
      next: (response: any) => {
        alert(response.message);
        debugger;
      },
      complete: () => {
        this.getOrderDetail(parseInt(this.id));
        debugger;
      },
      error: (error) => {
        debugger;
        console.log(error);
      },
    });
  }
}
