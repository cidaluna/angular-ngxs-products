import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../state/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-products-child',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-child.component.html',
  styleUrl: './products-child.component.scss'
})
export class ProductsChildComponent {
  // agora recebe array diretamente e garante valor padrão
  private _products: IProduct[] = [];
  @Input() set products(value: IProduct[] | null | undefined) {
    console.log('[ProductsChildComponent] @Input products recebido:', value);
    this._products = Array.isArray(value) ? [...value] : [];
    console.log('[ProductsChildComponent] products interno agora:', this._products);
  }
  get products(): IProduct[] {
    return this._products;
  }

  // Eventos que voltam para o componente pai
  @Output() addProduct = new EventEmitter<string>();
  @Output() deleteProduct = new EventEmitter<number>();

  // Método que emite o novo nome ao pai
  onAdd(nameInput: HTMLInputElement) {
    console.log('[ProductsChildComponent] onAdd chamado com valor:', nameInput.value);
    const name = nameInput.value;
    this.addProduct.emit(name);
    nameInput.value = '';
  }

  // Método que emite o ID ao pai
  remove(id: number) {
    console.log('[ProductsChildComponent] remove chamado com ID:', id);
    this.deleteProduct.emit(id);
  }
}
