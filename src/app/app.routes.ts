import { Routes } from '@angular/router';
import { SimulatorAutoFinancialComponent } from './simulator-auto-financial/simulator-auto-financial.component';
import { ParentComponent } from './parent/parent.component';
import { ChildOneComponent } from './child-one/child-one.component';
import { ChildTwoComponent } from './child-two/child-two.component';
import { ChildThreeComponent } from './child-three/child-three.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

export const routes: Routes = [
  { path: '', redirectTo: '/simulator', pathMatch: 'full' },
  { path: 'simulator', component: SimulatorAutoFinancialComponent },
  { path: 'parent', component: ParentComponent },
  { path: 'child-one', component: ChildOneComponent },
  { path: 'child-two', component: ChildTwoComponent },
  { path: 'child-three', component: ChildThreeComponent },
  { path: 'contact-us', component: ContactUsComponent }
];
