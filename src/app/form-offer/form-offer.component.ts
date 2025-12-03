import { Component, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { OfferState } from '../state/offer/offer.state';
import { CreateOffer } from '../state/offer/offer.actions';

@Component({
  selector: 'app-form-offer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-offer.component.html',
  styleUrl: './form-offer.component.scss'
})
export class FormOfferComponent {
  form: FormGroup;
  // signals para consumir o estado selectors
  loading!: Signal<boolean | undefined>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      active: [true],
    });

    this.loading = toSignal(this.store.select(OfferState.loading));
  }


  onSubmit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.value;
    this.store.dispatch(new CreateOffer(dto)).subscribe({
      next: () => {
        console.log('[FormOfferComponent] Oferta criada com sucesso');
        this.form.reset({ title: '', description: '', price: 0, active: true });
      },
      error: (error) => {
        // ngxs já trata o erro no estado, mas podemos logar aqui também
        console.error('[FormOfferComponent] Erro ao criar oferta:', error);
      }
    });
  }
}
