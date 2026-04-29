export interface Person {
  name: string;
  taxId: string;
  email: string;
}

const PEOPLE: Person[] = [
  { name: 'Ana Clara Souza',      taxId: '527.925.050-36', email: 'ana.souza@email.com' },
  { name: 'Bruno Lima',           taxId: '123.456.789-09', email: 'bruno.lima@email.com' },
  { name: 'Carla Ferreira',       taxId: '099.845.660-80', email: 'carla.ferreira@email.com' },
  { name: 'Diego Martins',        taxId: '270.239.970-32', email: 'diego.martins@email.com' },
  { name: 'Eduarda Ramos',        taxId: '587.853.790-77', email: 'eduarda.ramos@email.com' },
  { name: 'Felipe Costa',         taxId: '740.063.730-40', email: 'felipe.costa@email.com' },
  { name: 'Gabriela Alves',       taxId: '111.444.777-35', email: 'gabriela.alves@email.com' },
  { name: 'Henrique Oliveira',    taxId: '007.930.400-19', email: 'henrique.oliveira@email.com' },
  { name: 'Isabela Rodrigues',    taxId: '648.175.020-29', email: 'isabela.rodrigues@email.com' },
  { name: 'João Pedro Nascimento',taxId: '352.982.247-76', email: 'joao.nascimento@email.com' },
  { name: 'Karina Mendes',        taxId: '831.727.970-74', email: 'karina.mendes@email.com' },
  { name: 'Lucas Pardinho',       taxId: '481.476.280-13', email: 'lucas.pardinho@email.com' },
];

export function getRandomPeople(count: number): Person[] {
  const shuffled = [...PEOPLE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, PEOPLE.length));
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
