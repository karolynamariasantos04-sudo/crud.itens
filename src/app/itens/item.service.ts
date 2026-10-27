import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:5166/api/itens';

  listar(): Observable<Item[]> {
    return this.http.get<Item[]>(this.url);
  }

  criar(item: Item): Observable<Item> {
    return this.http.post<Item>(this.url, item);
  }

  atualizar(id: number, item: Item): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, item);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}