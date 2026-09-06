import { Injectable } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private readonly meta: Meta) {}

  updateMetaTags = (tags: MetaDefinition[]) => {
    tags.forEach((item) => {
      this.meta.updateTag(item);
    });
  };

  removeMetaTags = () => {
    this.meta.removeTag('name=title');
    this.meta.removeTag('name=description');
  };
}
