import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(HeaderComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(FooterComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(HomeComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(ProductComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(ProductDetailsComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(CartComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(ContactComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(BlogComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(LoginComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(HomeComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(RegisterComponent, appConfig).catch((err) =>
//   console.error(err)
// );
