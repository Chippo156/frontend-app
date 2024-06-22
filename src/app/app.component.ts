import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const paymentStatus = params['vnp_ResponseCode'];
      if (paymentStatus === '00') {
        alert('Thanh toán thành công');
      } else if (paymentStatus === '01') {
        alert('Thanh toán thất bại');
      }
    });
  }
  navigateHome() {
    this.router.navigate(['/'], { queryParams: { paymentStatus: '00' } });
  }
}
