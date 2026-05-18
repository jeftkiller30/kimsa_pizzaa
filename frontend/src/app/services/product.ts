import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private firestore = inject(Firestore);

  getProductos() {
    const ref = collection(this.firestore, 'productos');
    return collectionData(ref, { idField: 'id' });
  }
}