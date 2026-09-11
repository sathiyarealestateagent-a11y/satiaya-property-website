import type { EditableProperty } from './schema';

const RUMAH_SELANGORKU_TERMS = ['rumah selangorku', 'selangorku'];

export function isRumahSelangorkuProperty(property: EditableProperty) {
  const searchableText = [
    property.title,
    property.propertyType,
    property.description,
    property.projectInfo,
    property.packageDetails,
    property.amenities,
  ]
    .join(' ')
    .toLocaleLowerCase('en-MY');

  return RUMAH_SELANGORKU_TERMS.some((term) => searchableText.includes(term));
}
