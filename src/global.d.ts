/// <reference types="umami" />

declare module '*.png' {
  const src: string;
  const height: number;
  const width: number;
  export { src, height, width };
  const content: { src: string; height: number; width: number };
  export default content;
}

declare module '*.jpg' {
  const src: string;
  const height: number;
  const width: number;
  export { src, height, width };
  const content: { src: string; height: number; width: number };
  export default content;
}

declare module '*.jpeg' {
  const src: string;
  const height: number;
  const width: number;
  export { src, height, width };
  const content: { src: string; height: number; width: number };
  export default content;
}

declare module '*.gif' {
  const src: string;
  const height: number;
  const width: number;
  export { src, height, width };
  const content: { src: string; height: number; width: number };
  export default content;
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.webp' {
  const src: string;
  const height: number;
  const width: number;
  export { src, height, width };
  const content: { src: string; height: number; width: number };
  export default content;
}
