
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Item } from './item.model';
import { ItemService } from './item.service';

@Component({
  selector: 'app-itens',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],

  template: `
    <h2>Itens</h2>

    <form [formGroup]="form" (ngSubmit)="salvar()">
      <input
        formControlName="nome"
        placeholder="Nome"
        maxlength="100"
      />

      <input
        formControlName="descricao"
        placeholder="Descrição"
      />

      <input
        formControlName="preco"
        type="number"
        min="0"
        step="0.01"
        placeholder="Preço"
      />

      <button type="submit" [disabled]="form.invalid">
        {{ editandoId !== null
          ? 'Salvar alterações'
          : 'Adicionar item' }}
      </button>

      <button
        type="button"
        *ngIf="editandoId !== null"
        (click)="cancelar()"
      >
        Cancelar
      </button>
    </form>

    <p *ngIf="itens.length === 0">
      Nenhum item cadastrado. Adicione o primeiro acima.
    </p>

    <table *ngIf="itens.length > 0">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>

            <tbody>
        <tr *ngFor="let item of itens">
          <td>{{ item.nome }}</td>
          <td>{{ item.descricao }}</td>
          <td>R$ {{ item.preco | number: '1.2-2' }}</td>
          <td>
            <button type="button" (click)="editar(item)">Editar</button>
            <button type="button" (click)="excluir(item)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,

  styles: [`
    form {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    input {
      padding: 6px 8px;
    }

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th, td {
      text-align: left;
      padding: 8px;
      border-bottom: 1px solid #ddd;
    }

    td button {
      margin-right: 6px;
    }
  `]
})

export class ItensComponent implements OnInit {
  private service = inject(ItemService);
  private fb = inject(FormBuilder);

  itens: Item[] = [];
  editandoId: number | null = null;

  form = this.fb.nonNullable.group({
    nome: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    descricao: [''],
    preco: [0, [
      Validators.required,
      Validators.min(0)
    ]]
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe({
      next: (dados) => {
        this.itens = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar itens:', erro);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const item: Item = this.form.getRawValue();

    const concluir = () => {
      this.cancelar();
      this.carregar();
    };

    if (this.editandoId !== null) {
      this.service.atualizar(this.editandoId, item).subscribe({
        next: concluir,
        error: (erro) => {
          console.error('Erro ao atualizar item:', erro);
        }
      });
    } else {
      this.service.criar(item).subscribe({
        next: concluir,
        error: (erro) => {
          console.error('Erro ao criar item:', erro);
        }
      });
    }
  }

  editar(item: Item) {
    this.editandoId = item.id ?? null;
    this.form.setValue({
      nome: item.nome,
      descricao: item.descricao ?? '',
      preco: item.preco,
    });
  }
  cancelar(): void {
    this.editandoId = null;

    this.form.reset({
      nome: '',
      descricao: '',
      preco: 0
    });
  }

  excluir(item: Item): void {
    if (item.id == null) {
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente excluir o item "${item.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    this.service.excluir(item.id).subscribe({
      next: () => {
        this.carregar();

        if (this.editandoId === item.id) {
          this.cancelar();
        }
      },
      error: (erro) => {
        console.error('Erro ao excluir item:', erro);
      }
    });
  }
}
