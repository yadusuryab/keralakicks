import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import product from './product'
import review from './review'
import order from './order'
import banner from './banner'
import brand from './brand'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, review, order,banner,brand],
}
