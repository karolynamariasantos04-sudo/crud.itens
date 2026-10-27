import { Component } from '@angular/core';
import { ItensComponent } from './itens/itens.component';

@Component({
  selector: 'app-root',
  imports: [ItensComponent],
  template: `<app-itens />`,
})
export class App {}