// src/app/services/shared-state.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private currentSubjectId: number | null = null;

  setCurrentSubjectId(id: number): void {
    console.log('SharedStateService: Setting current subject ID to', id);
    this.currentSubjectId = id;
  }

  getCurrentSubjectId(): number | null {
    return this.currentSubjectId;
  }
}