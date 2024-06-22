import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CartComponent } from '../cart/cart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutingModule } from '../../app.routes';
import { CartService } from '../../service/cart.service';
import { HomeComponent } from '../home/home.component';
import { UserResponse } from '../../responses/userResponse';
import { UserService } from '../../service/user.service';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { bottom } from '@popperjs/core';
import { TokenService } from '../../service/token.service';
import { CommmentService } from '../../service/comment.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userResponse!: UserResponse | undefined;
  isPoperoverOpen = false;

  constructor(
    private userService: UserService,
    private ngbPopoverConfig: NgbPopoverConfig,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.userResponse = userService.getUserResponseFromLocalStorage()!;
  }

  protected readonly bottom = bottom;
  togglePopover(event: Event) {
    event.preventDefault();
    this.isPoperoverOpen = !this.isPoperoverOpen;
  }
  handleItemClick(index: number) {
    if (index === 0) {
      this.router.navigate(['/']);
    } else {
      if (index === 2) {
        this.userService.removeUserResponseFromLocalStorage();
        this.tokenService.removeToken();
        this.userResponse = this.userService.getUserResponseFromLocalStorage();
      } else {
        if (index === 1) {
          this.router.navigate(['/orders']);
        }
      }
    }
    this.isPoperoverOpen = false;
  }
}
