declare module '@/components/alimentos.json' {
  interface Alimento {
    id: number;
    nombre: string;
    icon: string;
    precio: number;
    categoria: string;
  }

  const alimentos: Alimento[];
  export default alimentos;
}
