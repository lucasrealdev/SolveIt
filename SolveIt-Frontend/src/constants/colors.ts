// colors.ts
import tinycolor from 'tinycolor2';

// Definição do tipo de chave para as cores
export type ColorName = 'textStandard' | 'backgroundStandard' | 'primaryStandard' | 'secondaryStandard' | 'accentStandard' | 
                        'textStandardDark' | 'backgroundStandardDark' | 'primaryStandardDark' | 'secondaryStandardDark' | 'accentStandardDark' |
                        'textSecondary' | 'backgroundStandardLight' | 'borderStandard' | 'borderStandardLight';

// Definição do tipo Color que vai garantir a estrutura das cores
interface Color {
  standard: string;
  hover: string;
  pressIn: string;
}

// Função para gerar as versões hover e pressIn a partir da cor padrão
const createHoverAndPressColors = (color: string): { hover: string, pressIn: string } => {
  const hover = tinycolor(color).darken(10).toString();  // Cor escurecida para hover (10%)
  const pressIn = tinycolor(color).darken(20).toString();  // Cor escurecida para pressIn (20%)
  return { hover, pressIn };
}

// Agora definimos as cores com os tipos de chave
const colors: Record<ColorName, Color> = {
  textStandard: { 
    standard: '#c5d0e2', 
    ...createHoverAndPressColors('#c5d0e2') 
  },
  backgroundStandard: { 
    standard: '#030507', 
    ...createHoverAndPressColors('#030507') 
  },
  primaryStandard: { 
    standard: '#4dc0fe', 
    ...createHoverAndPressColors('#4dc0fe') 
  },
  secondaryStandard: { 
    standard: '#3a9ed6', 
    ...createHoverAndPressColors('#3a9ed6') 
  },
  accentStandard: { 
    standard: '#4dfee4', 
    ...createHoverAndPressColors('#4dfee4') 
  },

  textStandardDark: { 
    standard: '#1d283a', 
    ...createHoverAndPressColors('#1d283a') 
  },
  backgroundStandardDark: { 
    standard: '#f8fafc', 
    ...createHoverAndPressColors('#f8fafc') 
  },
  primaryStandardDark: { 
    standard: '#0174b2', 
    ...createHoverAndPressColors('#0174b2') 
  },
  secondaryStandardDark: { 
    standard: '#298dc7', 
    ...createHoverAndPressColors('#298dc7') 
  },
  accentStandardDark: { 
    standard: '#01b297', 
    ...createHoverAndPressColors('#01b297') 
  },

  textSecondary: { 
    standard: '#475569', 
    ...createHoverAndPressColors('#475569') 
  },

  backgroundStandardLight: { 
    standard: '#fff', 
    ...createHoverAndPressColors('#fff') 
  },
  borderStandard: { 
    standard: '#CBD5E1', 
    ...createHoverAndPressColors('#CBD5E1') 
  },
  borderStandardLight: { 
    standard: '#E2E8F0', 
    ...createHoverAndPressColors('#E2E8F0') 
  },
};

export default colors;
